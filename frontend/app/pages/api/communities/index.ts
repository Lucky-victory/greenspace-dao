import { db } from "@/db";
import { communities } from "@/db/schema";
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
    type STATUS = "published" | "draft" | "deleted";
    const { status = "published" } = req.query;
    const communitiesResult = await db.query.communities.findMany({
      where: eq(communities.status, status as STATUS),
    });
    return successHandlerCallback(req, res, {
      message: "Data retrieved successfully",
      data: communitiesResult,
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
    const createdCommunity = await db.transaction(async (tx) => {
      const [insertRes] = await tx.insert(communities).values(data);
      const createdCommunity = await tx.query.communities.findFirst({
        where: eq(communities.id, insertRes.insertId),
      });
      return createdCommunity;
    });
    return successHandlerCallback(req, res, {
      message: "Community created successfully",
      data: createdCommunity,
    });
  } catch (error) {
    return errorHandlerCallback(req, res, {
      message: "Something went wrong...",
      data: null,
      error,
    });
  }
};
