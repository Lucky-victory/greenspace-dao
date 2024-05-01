import { db } from "@/db";
import { meetings } from "@/db/schema";
import {
  HTTP_METHOD_CB,
  errorHandlerCallback,
  mainHandler,
  successHandlerCallback,
} from "@/utils";
import { eq } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return mainHandler(req, res, {
    GET,
    POST,
  });
}

export const GET: HTTP_METHOD_CB = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const meetings = await db.query.meetings.findMany();
    return successHandlerCallback(req, res, {
      message: "Meetings received successfully",
      data: meetings,
    });
  } catch (error) {
    return errorHandlerCallback(req, res, {
      message: "Something went wrong...",
      data: null,
    });
  }
};
export const POST: HTTP_METHOD_CB = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const data = req.body;
    const createdMeeting = await db.transaction(async (tx) => {
      const [insertResponse] = await tx.insert(meetings).values(data);
      const meeting = await tx.query.meetings.findFirst({
        with: {
          author: {
            columns: {
              id: true,
              authId: true,
              address: true,
              chainId: true,
            },
          },
        },
        where: eq(meetings.id, insertResponse.insertId),
      });
      return meeting;
    });
    return successHandlerCallback(req, res, {
      message: "Meeting created successfully",
      data: createdMeeting,
    });
  } catch (error) {
    return errorHandlerCallback(req, res, {
      error,
      message: "Something went wrong...",
      data: null,
    });
  }
};
