import { db } from "@/db";
import { communities, communityMembers, communityMessages } from "@/db/schema";
import {
  HTTP_METHOD_CB,
  errorHandlerCallback,
  flattenArray,
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
    POST,
  });
}

export const GET: HTTP_METHOD_CB = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { spaceIdOrId } = req.query as { spaceIdOrId: string | number };

    const community = await db.query.communities.findFirst({
      columns: {},
      where: or(
        eq(communities.spaceId, spaceIdOrId as string),
        eq(communities.id, spaceIdOrId as number)
      ),
      with: {
        messages: {
          columns: {
            message: true,
            createdAt: true,
          },
          with: {
            attachments: {
              columns: {
                content: true,
                id: true,
              },
            },
            author: {
              columns: {
                id: true,
                authId: true,
                username: true,
                avatar: true,
                fullName: true,
                address: true,
              },
            },
          },
        },
      },
    });
    const communityMessages = community?.messages;
    return successHandlerCallback(req, res, {
      message: "community messages retrieved successfully",
      data: communityMessages,
    });
  } catch (error) {
    console.log({ error });

    return errorHandlerCallback(req, res, {
      message: "Something went wrong...",
      data: null,
      error,
    });
  }
};

export const POST: HTTP_METHOD_CB = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const data = req.body;

    const createdRecord = await db.transaction(async (tx) => {
      const [insertRes] = await tx.insert(communityMessages).values(data);

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
              address: true,
            },
          },
        },
      });
    });
    return successHandlerCallback(req, res, {
      message: "Message added successfully",
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
