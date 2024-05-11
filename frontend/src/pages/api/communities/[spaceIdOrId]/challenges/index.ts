import { db } from "@/db";
import { communities, communityChallenges, communityEvents } from "@/db/schema";
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
        challenges: {
          columns: {
            communityId: false,
          },
          with: {
            tags: {
              columns: {
                createdAt: false,
                updatedAt: false,
              },
            },
          },
        },
      },
    });
    const challenges = community?.challenges;
    return successHandlerCallback(req, res, {
      message: "community challenges retrieved successfully",
      data: challenges,
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

    const createdRecord = await db.transaction(async (tx) => {
      const [insertRes] = await tx.insert(communityChallenges).values(data);

      return tx.query.communityChallenges.findFirst({
        where: eq(communityChallenges.id, insertRes.insertId),
      });
    });
    return successHandlerCallback(req, res, {
      message: "Challenges added successfully",
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
