import { db } from "src/db";
import { communities, communityEvents } from "src/db/schema";
import {
  HTTP_METHOD_CB,
  errorHandlerCallback,
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
        events: {
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
    const events = community?.events;
    return successHandlerCallback(req, res, {
      message: "community events retrieved successfully",
      data: events,
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
      const [insertRes] = await tx.insert(communityEvents).values(data);

      return tx.query.communityEvents.findFirst({
        where: eq(communityEvents.id, insertRes.insertId),
      });
    });
    return successHandlerCallback(req, res, {
      message: "Event added successfully",
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
