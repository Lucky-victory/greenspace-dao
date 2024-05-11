import { db } from "@/db";
import { communities, communityMessages } from "@/db/schema";
import {
  HTTP_METHOD_CB,
  errorHandlerCallback,
  mainHandler,
  successHandlerCallback,
} from "@/utils";
import { eq, or } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";

import { getPusherInstance } from "@/lib/pusher/server";
const pusherServer = getPusherInstance();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return mainHandler(req, res, {
    // GET: pusherHandler,
    POST: pusherHandler,
  });
}

export const pusherHandler: HTTP_METHOD_CB = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { communityId } = req.query as { communityId: string };
  const data = req.body;
  if (!communityId) throw new Error("communityId is required");
  try {
    const community = (await getCommunity(
      req
    )) as typeof communities.$inferSelect;
    const storedData = await db.transaction(async (tx) => {
      const [insertRes] = await tx.insert(communityMessages).values({
        communityId: community.id,
        userId: data?.userId,
        message: data?.message,
      });
      return tx.query.communityMessages.findFirst({
        where: eq(communityMessages.id, insertRes.insertId),
        with: {
          author: {
            columns: {
              id: true,
              authId: true,
              username: true,
              avatar: true,
              fullName: true,
            },
          },
        },
      });
    });
    await pusherServer.trigger(communityId as string, "evt::message", {
      ...storedData,
    });

    return successHandlerCallback(req, res, { message: "Sockets tested" }, 200);
  } catch (error) {
    console.error(error);
    return errorHandlerCallback(
      req,
      res,
      { message: "Failed to test sockets", error: error },
      500
    );
  }
};
export const getCommunity = async (req: NextApiRequest) => {
  try {
    const { communityId } = req.query as { communityId: string | number };
    const community = await db.query.communities.findFirst({
      where: or(
        eq(communities.spaceId, communityId as string),
        eq(communities.id, communityId as number)
      ),
    });
    return community;
  } catch (error) {
    throw error;
  }
};
