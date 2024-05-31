import { db } from "src/db";
import { communityMembers } from "src/db/schema";
import {
  HTTP_METHOD_CB,
  errorHandlerCallback,
  mainHandler,
  successHandlerCallback,
} from "src/utils";
import { NextApiRequest, NextApiResponse } from "next";

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

    const createdRecord = await db.transaction(async (tx) => {
      const [insertRes] = await tx.insert(communityMembers).values(data);

      return { id: insertRes?.insertId };
    });
    return successHandlerCallback(req, res, {
      message: "Community Joined successfully",
      data: createdRecord,
    });
  } catch (error) {
    return errorHandlerCallback(req, res, {
      message: "Something went wrong...",
      data: null,
      error,
    });
  }
};
