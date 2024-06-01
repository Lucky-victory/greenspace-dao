import { getPusherInstance } from "src/lib/pusher/server";
import { HTTP_METHOD_CB, errorHandlerCallback, mainHandler, successHandlerCallback } from "src/utils";
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
interface Payload {
  // Define the structure of your payloads here
  [key: string]: any;
}

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

async function handleAskQuestion(roomId: string, payload: Payload): Promise<void> {
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
