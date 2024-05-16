import { db } from "src/db";
import { communities, communityMembers } from "src/db/schema";
import {
  HTTP_METHOD_CB,
  errorHandlerCallback,
  flattenArray,
  mainHandler,
  successHandlerCallback,
} from "src/utils";
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
        members: {
          columns: {
            xp: true,
            role: true,
            createdAt: true,
          },
          with: {
            user: {
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
    const flattenedMembers = flattenArray(community?.members!, (member) => {
      if (member?.user) {
        return {
          createdAt: member.createdAt,
          role: member.role,
          xp: member.xp,
          ...member.user,
        };
      }
      return null;
    });
    return successHandlerCallback(req, res, {
      message: "community members retrieved successfully",
      data: flattenedMembers,
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
    const { communityId, userId } = req.body;

    const createdRecord = await db.transaction(async (tx) => {
      const [insertRes] = await tx
        .insert(communityMembers)
        .values({ communityId, userId });

      return tx.query.communityMembers.findFirst({
        where: eq(communityMembers.id, insertRes.insertId),
      });
    });
    return successHandlerCallback(req, res, {
      message: "Member joined successfully",
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
