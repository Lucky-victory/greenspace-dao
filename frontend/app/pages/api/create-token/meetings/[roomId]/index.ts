import { db } from "@/db";
import { meetings } from "@/db/schema";
import {
  HTTP_METHOD_CB,
  errorHandlerCallback,
  mainHandler,
  successHandlerCallback,
} from "@/utils";
import { eq, or } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return mainHandler(req, res, {
    GET,
  });
}

export const GET: HTTP_METHOD_CB = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { roomId } = req.query;
    const meeting = await db.query.meetings.findFirst({
      with: {
        creator: {
          columns: {
            chainId: true,
            authId: true,
            address: true,
            id: true,
          },
        },
      },
      where: eq(meetings.roomId, roomId as string),
    });
    return successHandlerCallback(req, res, {
      message: "Meeting received successfully",
      data: meeting,
    });
  } catch (error) {
    return errorHandlerCallback(req, res, {
      message: "Something went wrong...",
      data: null,
    });
  }
};
