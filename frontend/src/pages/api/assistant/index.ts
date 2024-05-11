import { db } from "@/db";
import { global, users } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";
import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import type { Server as IOServer } from "socket.io";
import { Server } from "socket.io";

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

let io: IOServer;
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default function websocketHandler(
  _: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      // When a user connects, create a unique room for them
      const roomId = socket.id;
      socket.join(roomId);
      console.log("SOCKET WORKS, ROOM: ", roomId);

      // Handle WebSocket events
      socket.on("message", (data) => {
        messageRouter(roomId, data);
      });

      // Handle disconnections
      socket.on("disconnect", () => {
        // Remove the user from the room
        socket.leave(roomId);
      });
    });
  }

  res.end();
}

async function messageRouter(
  roomId: string,
  data: { type: any; payload: any }
) {
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
      console.error("Unknown message type:", data.type);
  }
}

// Generic Assistant Wrapper Handlers

async function handleListThreadIds(
  roomId: string,
  arg: { addressOrUsername: string }
) {
  const user = await getUserByAddressOrUsername(arg.addressOrUsername);
  console.log("user");
  console.log(user);
  io.to(roomId).emit("thread-ids", user?.aiCoachThreadIds);
}

async function handleGetThread(roomId: string, arg: { threadId: string }) {
  const threadMessages = await listThreadMessages(arg.threadId);
  io.to(roomId).emit("thread-messages", threadMessages);
}

async function handleCreateThread(
  roomId: string,
  arg: { content: string; addressOrUsername: string }
) {
  try {
    const user = await getUserByAddressOrUsername(arg.addressOrUsername);

    // Create new thread and update users threads ids.
    const threadId = await createThread(arg.content);
    const threadIds =
      user?.aiCoachThreadIds + " " + threadId + "::" + Date.now();
    await db
      .update(users)
      .set({ aiCoachThreadIds: threadIds.trim() })
      .where(
        or(
          eq(users.address, arg.addressOrUsername),
          eq(users.username, arg.addressOrUsername)
        )
      );

    io.to(roomId).emit("thread-created", threadId);

    // Run the stream for the new thread.
    const assistantId = await getAssistantId();
    const instruction = user?.fullName
      ? `Please address the user as ${user?.fullName}.`
      : "";
    createRunStream(
      threadId,
      assistantId,
      instruction,
      (stream: string) => {
        io.to(roomId).emit("stream-response", stream);
      },
      (done: boolean) => {
        io.to(roomId).emit("stream-finished", done);
      }
    );
    console.log(1);
  } catch (error) {
    console.error(error);
    console.error("Uninitialized assistant Id 1");
  }
}

async function handleDeleteThread(
  roomId: string,
  arg: { threadId: string; addressOrUsername: string }
) {
  try {
    // Remove thread from user db.
    const user = await getUserByAddressOrUsername(arg.addressOrUsername);
    const aiCoachThreadIds = removeWordFromString(
      user?.aiCoachThreadIds || "",
      roomId
    );
    await db
      .update(users)
      .set({ aiCoachThreadIds })
      .where(
        or(
          eq(users.address, arg.addressOrUsername),
          eq(users.username, arg.addressOrUsername)
        )
      );

    // Delete thread from Open AI servers.
    await deleteThread(arg.threadId);

    io.to(roomId).emit("thread-deleted", true);
  } catch {
    io.to(roomId).emit("thread-deleted", false);
    console.error("Unable to delete thread: ", arg.threadId);
  }
}

async function handleAskQuestion(
  roomId: string,
  arg: { threadId: string; content: string; addressOrUsername: string }
) {
  try {
    // Add user message to the thread.
    await createThreadMessage(arg.threadId, arg.content);

    // Run the stream for the thread.
    const user = await getUserByAddressOrUsername(arg.addressOrUsername);
    const assistantId = await getAssistantId();
    const instruction = user?.fullName
      ? `Please address the user as ${user?.fullName}.`
      : "";
    createRunStream(
      arg.threadId,
      assistantId,
      instruction,
      (stream: string) => {
        io.to(roomId).emit("stream-response", stream);
      },
      (done: boolean) => {
        io.to(roomId).emit("stream-finished", done);
      }
    );
    console.log(2);
  } catch {
    console.error("Uninitialized assistant Id 2");
  }
}

// Assistant Logic Implementations
// Docs https://platform.openai.com/docs/assistants/overview

const defaultInstruction = `
  You are GreenspaceAI, an advanced AI nutritionist coach designed to provide personalized guidance to help users achieve their health and fitness goals through proper nutrition. Your key features include:

  Personalized Meal Planning tailored to the user's dietary needs, preferences, goals like weight loss, muscle gain, disease management or overall wellness.
  Nutritional Analysis by having the user snap photos of their meals for you to analyze nutritional content, calories, macros, vitamins etc.
  AI Health Coaching by acting as a knowledgeable partner providing motivation, tips, education and accountability to develop sustainable healthy eating habits.
  Smart Grocery Lists generated based on the user's meal plan to streamline shopping for healthy ingredients.
  Recipe Recommendations of tasty, nutritionist-approved recipes suited to the user's needs to expand their culinary skills while staying healthy.
  Your goal is to be an affordable, convenient virtual nutritionist, empowering users to take control of their diet and wellbeing through advanced AI capabilities. You should guide users through the onboarding process to customize your services for their individual needs and goals. Then provide an interactive experience allowing meal planning, food logging, coaching, grocery lists and recipes tailored specifically for each user.
`;

async function createAssistant() {
  const assistant = await client.beta.assistants.create({
    name: "GreenspaceAI",
    instructions: defaultInstruction,
    model: "gpt-3.5-turbo-0125",
  });
  return assistant.id;
}

async function createThread(content: string) {
  const messageThread = await client.beta.threads.create({
    messages: [{ role: "user", content }],
  });
  return messageThread.id;
}

async function deleteThread(thread_id: string) {
  const response = await client.beta.threads.del(thread_id);
  console.log(response);
}

async function createThreadMessage(thread_id: string, content: string) {
  const threadMessage = await client.beta.threads.messages.create(thread_id, {
    role: "user",
    content,
  });
  return threadMessage;
}

async function listThreadMessages(thread_id: string) {
  const threadMessages = await client.beta.threads.messages.list(thread_id);
  return threadMessages.getPaginatedItems();
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
    instructions: instructions
      ? defaultInstruction + "\n\n" + instructions
      : instructions,
  });
  run.on("textDelta", (textDelta, snapshot) => {
    textCallback(textDelta.value || "");
  });
  run.on("messageDone", (text) => doneCallback(true));
}

// Handlers helpers

async function getUserByAddressOrUsername(addressOrUsername: string) {
  const condition = or(
    eq(users.address, addressOrUsername),
    eq(users.username, addressOrUsername)
  );

  return await db.query.users.findFirst({
    columns: {
      fullName: true,
      aiCoachThreadIds: true,
    },
    where: condition,
  });
}

async function getAssistantId() {
  const globalInfo = await db.query.global.findFirst();
  let assistantId = globalInfo?.greenspaceAIId;

  if (!assistantId) {
    assistantId = await createAssistant();
    await db.update(global).set({ greenspaceAIId: assistantId });
  }

  return assistantId;
}

function removeWordFromString(inputString: string, wordToRemove: string) {
  const regex = new RegExp("\\b" + wordToRemove + "\\b", "gi");
  return inputString.replace(regex, "").replace(/\s+/g, " ").trim();
}
