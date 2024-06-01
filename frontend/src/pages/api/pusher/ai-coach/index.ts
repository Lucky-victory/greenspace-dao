import { getPusherInstance } from "src/lib/pusher/server";
import { HTTP_METHOD_CB, errorHandlerCallback, logger, mainHandler, successHandlerCallback } from "src/utils";
import { db } from "src/db";
import { global, users } from "src/db/schema";
import OpenAI from "openai";
import { eq, or } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";
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

// Define handler functions
async function handleListThreadIds(roomId: string, payload: Payload): Promise<void> {
  // Implementation here
}

async function handleGetThread(roomId: string, payload: Payload): Promise<void> {
  // Implementation here
}

async function handleCreateThread(roomId: string, payload: Payload): Promise<void> {
  // Implementation here
}

async function handleDeleteThread(roomId: string, payload: Payload): Promise<void> {
  // Implementation here
}

// Function to handle actions
async function handleAction(roomId: string, data: Action): Promise<void> {
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
    const { usernameOrAuthId } = req.query as { usernameOrAuthId: string };
    const user = await getUser(usernameOrAuthId);

    if (!user) return errorHandlerCallback(req, res, { message: "Unauthorized" }, 401);

    await pusherServer.trigger(user?.authId as string, "evt::message", {});
  } catch (error) {}
};
export async function getUser(usernameOrAuthId: string) {
  try {
    return await db.query.users.findFirst({
      where: or(eq(users.username, usernameOrAuthId), eq(users.authId, usernameOrAuthId)),
      columns: {
        authId: true,
        fullName: true,
        aiCoachThreadIds: true,
      },
    });
  } catch (error) {}
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
  logger(messageThread);
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
  logger(threadMessage);
  return threadMessage;
}
async function listThreadMessages(thread_id: string) {
  const threadMessages = await client.beta.threads.messages.list(thread_id);
  logger(threadMessages);
  return threadMessages.getPaginatedItems();
}

async function handleAskQuestion(roomId: string, arg: { threadId: string; content: string; usernameOrAuthId: string }) {
  try {
    // Add user message to the thread.
    await createThreadMessage(arg.threadId, arg.content);

    // Run the stream for the thread.
    const user = await getUser(arg.usernameOrAuthId);
    const assistantId = await getAssistantId();
    const instruction = user?.fullName ? `Please address the user as ${user?.fullName}.` : "";
    createRunStream(
      arg.threadId,
      assistantId,
      instruction,
      (stream: string) => {
        pusherServer.trigger(user?.authId as string, "stream-response", stream);
      },
      (done: boolean) => {
        pusherServer.trigger(user?.authId as string, "stream-finished", done);
      }
    );
  } catch {
    console.error("Uninitialized assistant Id 2");
  }
}

function createRunStream(
  thread_id: string,
  assistant_id: string,
  instructions: string,
  textCallback: (stream: string) => void,
  doneCallback: (stream: boolean) => void
) {
  const run = client.beta.threads.runs.stream(thread_id, {
    assistant_id,
    // Custom instructions overrides the default system instruction reinclude `defaultInstruction`
    instructions: instructions ? defaultInstruction + "\n\n" + instructions : instructions,
  });
  run.on("textDelta", (textDelta, snapshot) => {
    textCallback(textDelta.value || "");
  });
  run.on("messageDone", (text) => doneCallback(true));
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
