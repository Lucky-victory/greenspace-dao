import { db } from "src/db";
import { communityEventParticipants } from "src/db/schema";
import {
  HTTP_METHOD_CB,
  errorHandlerCallback,
  mainHandler,
  successHandlerCallback,
} from "src/utils";
import { and, eq } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";
import isEmpty from "just-is-empty";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return mainHandler(req, res, {
    POST,
  });
}

export const POST: HTTP_METHOD_CB = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const data = req.body;

    const response = await db.query.communityEventParticipants.findFirst({
      where: and(
        eq(communityEventParticipants.userId, data.userId),
        eq(communityEventParticipants.eventId, data.eventId)
      ),
    });
    return successHandlerCallback(req, res, {
      message: "Already joined",
      data: { hasJoined: !isEmpty(response) },
    });
  } catch (error) {
    return errorHandlerCallback(req, res, {
      message: "Something went wrong...",
      data: null,
      error,
    });
  }
};
