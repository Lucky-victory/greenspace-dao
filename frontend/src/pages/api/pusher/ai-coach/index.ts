import { getPusherInstance } from "src/lib/pusher/server";
import {
  HTTP_METHOD_CB,
  errorHandlerCallback,
  generateUrlSafeId,
  logger,
  mainHandler,
  successHandlerCallback,
} from "src/utils";
import { db } from "src/db";
import { global, users } from "src/db/schema";
import OpenAI from "openai";
import { eq, or } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";
import isEmpty from "just-is-empty";
const pusherServer = getPusherInstance();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// Define the action types
type ActionType = "LIST_THREAD_IDS" | "GET_THREAD" | "CREATE_THREAD_WITH_QUESTION" | "DELETE_THREAD" | "ASK_QUESTION";

// Define the payload types
type Payload<T = any> = T;

// Define the data type
interface Action {
  type: ActionType;
  payload: Payload;
}

// Function to handle actions
async function handleAction(roomId: string, data: Action): Promise<void> {
  logger({ roomId, data: JSON.stringify(data) });
  switch (data.type) {
    case "LIST_THREAD_IDS":
      await handleListThreadIds(roomId, data.payload);
      break;
    case "GET_THREAD":
      await handleGetThread(roomId, data.payload);
      break;
    case "CREATE_THREAD_WITH_QUESTION":
      await handleCreateThread(roomId, data.payload);
      break;
    case "DELETE_THREAD":
      await handleDeleteThread(roomId, data.payload);
      break;
    case "ASK_QUESTION":
      await handleAskQuestion(roomId, data.payload);
      break;
    default:
      throw new Error(`Unhandled action type: ${data.type}`);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return mainHandler(req, res, {
    POST: pusherHandler,
  });
}

export const pusherHandler: HTTP_METHOD_CB = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { addressOrAuthId, roomId } = req.query as { addressOrAuthId: string; roomId: string };
    const data = req.body;
    if (isEmpty(addressOrAuthId) || isEmpty(roomId)) throw new Error(" addressOrAuthId & roomId are required");
    const user = await getUser(addressOrAuthId);

    if (!user) return errorHandlerCallback(req, res, { message: "Unauthorized" }, 401);

    await handleAction(roomId, data);
    return successHandlerCallback(req, res, {
      message: "Success",
    });
  } catch (error) {
    logger(error);
    return errorHandlerCallback(req, res, { error, message: "Something went wrong..." }, 500);
  }
};
async function handleDeleteThread(roomId: string, arg: { threadId: string; addressOrAuthId: string }) {
  try {
    // Remove thread from user db.
    const user = await getUser(arg.addressOrAuthId);
    const aiCoachThreadIds = removeWordFromString(user?.aiCoachThreadIds || "", roomId);
    await db
      .update(users)
      .set({ aiCoachThreadIds })
      .where(or(eq(users.address, arg.addressOrAuthId), eq(users.authId, arg.addressOrAuthId)));

    // Delete thread from Open AI servers.
    await deleteThread(arg.threadId);

    await pusherServer.trigger(roomId, "evt::thread-deleted", true);
  } catch {
    await pusherServer.trigger(roomId, "evt::thread-deleted", false);
    console.error("Unable to delete thread: ", arg.threadId);
  }
}
async function getUser(addressOrAuthId: string) {
  const user = await db.query.users.findFirst({
    where: or(eq(users.address, addressOrAuthId), eq(users.authId, addressOrAuthId)),
    columns: {
      authId: true,
      fullName: true,
      aiCoachThreadIds: true,
    },
  });
  logger(user, "getUser");
  return user;
}

async function createAssistant() {
  try {
    const assistant = await client.beta.assistants.create({
      name: "GreenspaceAI",
      instructions: defaultInstruction,
      model: "gpt-3.5-turbo-0125",
    });
    return assistant.id;
  } catch (error) {
    return "";
  }
}
async function getAssistantId() {
  try {
    const globalInfo = await db.query.global.findFirst();
    let assistantId = globalInfo?.greenspaceAIId;

    if (!assistantId) {
      assistantId = await createAssistant();
      await db.insert(global).values({ greenspaceAIId: assistantId });
    }

    return assistantId;
  } catch (error) {
    return "";
  }
}
async function createThread(content: string) {
  const messageThread = await client.beta.threads.create({
    messages: [{ role: "user", content }],
  });
  logger({ messageThread });
  return messageThread.id;
}
async function deleteThread(thread_id: string) {
  const response = await client.beta.threads.del(thread_id);
  logger(response);
}

async function createThreadMessage(thread_id: string, content: string) {
  const threadMessage = await client.beta.threads.messages.create(thread_id, {
    role: "user",
    content,
  });
  logger(threadMessage, "thread message");
  return threadMessage;
}
async function handleGetThread(roomId: string, arg: { threadId: string }) {
  const threadMessages = await listThreadMessages(arg.threadId);
  logger({ threadId: arg.threadId, threadMessages });
  await pusherServer.trigger(roomId, "evt::thread-messages", threadMessages);
}
async function listThreadMessages(thread_id: string) {
  try {
    const threadMessages = await client.beta.threads.messages.list(thread_id);
    logger({ threadMessages });
    return threadMessages.getPaginatedItems();
  } catch (error) {
    logger(error);
  }
}
async function handleListThreadIds(roomId: string, arg: { addressOrAuthId: string }) {
  console.log(arg);

  const user = await getUser(arg.addressOrAuthId);
  console.log("user");
  console.log({ user });
  if (user && user?.aiCoachThreadIds)
    await pusherServer.trigger(roomId, "evt::thread-ids", user?.aiCoachThreadIds || "");
}
async function handleCreateThread(roomId: string, arg: { content: string; addressOrAuthId: string }) {
  try {
    const user = await getUser(arg.addressOrAuthId);

    // Create new thread and update users threads ids.
    const threadId = await createThread(arg.content);
    const threadIds = user?.aiCoachThreadIds || "" + " " + threadId + "::" + Date.now();
    await db
      .update(users)
      .set({ aiCoachThreadIds: threadIds.trim() })
      .where(or(eq(users.address, arg.addressOrAuthId), eq(users.authId, arg.addressOrAuthId)));

    await pusherServer.trigger(roomId, "evt::thread-created", threadId);

    // Run the stream for the new thread.
    const assistantId = await getAssistantId();
    const instruction = user?.fullName ? `Please address the user as ${user?.fullName}.` : "";
    await createRunStream(
      threadId,
      assistantId,
      instruction,
      async (stream: string) => {
        console.log({ stream });

        await pusherServer.trigger(roomId, "evt::stream-response", stream);
      },
      async (done: boolean) => {
        console.log({ done });

        await pusherServer.trigger(roomId, "evt::stream-finished", done);
      }
    );
  } catch (error) {
    console.error(error);
    console.error("Uninitialized assistant Id 1");
  }
}
async function handleAskQuestion(roomId: string, arg: { threadId: string; content: string; addressOrAuthId: string }) {
  try {
    // Add user message to the thread.
    await createThreadMessage(arg.threadId, arg.content);

    // Run the stream for the thread.
    const user = await getUser(arg.addressOrAuthId);
    const assistantId = await getAssistantId();
    const instruction = user?.fullName ? `Please address the user as ${user?.fullName}.` : "";
    await createRunStream(
      arg.threadId,
      assistantId,
      instruction,
      async (stream: string) => {
        console.log({ stream }, "handleAskQuestion");
        await pusherServer.trigger(roomId, "evt::stream-response", stream);
      },
      async (done: boolean) => {
        console.log({ done }, "handleAskQuestion");
        await pusherServer.trigger(roomId, "evt::stream-finished", done);
      }
    );
  } catch {
    console.error("Uninitialized assistant Id 2");
  }
}

async function createRunStream(
  thread_id: string,
  assistant_id: string,
  instructions: string,
  textCallback: (stream: string) => Promise<void>,
  doneCallback: (stream: boolean) => Promise<void>
) {
  const run = client.beta.threads.runs.stream(thread_id, {
    assistant_id,
    // Custom instructions overrides the default system instruction reinclude `defaultInstruction`
    instructions: instructions ? defaultInstruction + "\n\n" + instructions : instructions,
  });
  run.on("textDelta", async (textDelta, snapshot) => {
    await textCallback(textDelta.value || "");
  });
  run.on("messageDone", async (text) => await doneCallback(true));
}

// Assistant Logic Implementations
// Docs https://platform.openai.com/docs/assistants/overview

export const defaultInstruction = `
  You are GreenspaceAI, an advanced AI nutritionist coach designed to provide personalized guidance to help users achieve their health and fitness goals through proper nutrition. Your key features include:

  Personalized Meal Planning tailored to the user's dietary needs, preferences, goals like weight loss, muscle gain, disease management or overall wellness.
  Nutritional Analysis by having the user snap photos of their meals for you to analyze nutritional content, calories, macros, vitamins etc.
  AI Health Coaching by acting as a knowledgeable partner providing motivation, tips, education and accountability to develop sustainable healthy eating habits.
  Smart Grocery Lists generated based on the user's meal plan to streamline shopping for healthy ingredients.
  Recipe Recommendations of tasty, nutritionist-approved recipes suited to the user's needs to expand their culinary skills while staying healthy.
  Your goal is to be an affordable, convenient virtual nutritionist, empowering users to take control of their diet and wellbeing through advanced AI capabilities. You should guide users through the onboarding process to customize your services for their individual needs and goals. Then provide an interactive experience allowing meal planning, food logging, coaching, grocery lists and recipes tailored specifically for each user.
`;
export const removeWordFromString = (inputString: string, wordToRemove: string) => {
  const regex = new RegExp("\\b" + wordToRemove + "\\b", "gi");
  return inputString.replace(regex, "").replace(/\s+/g, " ").trim();
};
