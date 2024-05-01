import { db } from "@/db";
import { communities } from "@/db/schema";
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
    PUT,
  });
}

export const GET: HTTP_METHOD_CB = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { spaceIdOrId } = req.query as { spaceIdOrId: string | number };
    const community = await getData(req);

    if (!community) {
      return await successHandlerCallback(
        req,
        res,
        {
          message: `Community with id '${spaceIdOrId}' does not exist`,
          data: null,
        },
        404
      );
    }
    return successHandlerCallback(req, res, {
      message: "data retrieved successfully",
      data: community,
    });
  } catch (error) {
    return errorHandlerCallback(req, res, {
      message: "Something went wrong...",
      data: null,
    });
  }
};
export const PUT: HTTP_METHOD_CB = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const data = req.body;
    const { spaceIdOrId } = req.query as { spaceIdOrId: string | number };
    const community = await getData(req);

    if (!community) {
      return await successHandlerCallback(
        req,
        res,
        {
          message: `Community with id '${spaceIdOrId}' does not exist`,
          data: null,
        },
        404
      );
    }
    //TODO: Add authorization check
    const updatedRecord = await db.transaction(async (tx) => {
      await tx
        .update(communities)
        .set(data)
        .where(
          or(
            eq(communities.spaceId, spaceIdOrId as string),
            eq(communities.id, spaceIdOrId as number)
          )
        );
      return tx.query.communities.findFirst({
        where: or(
          eq(communities.spaceId, spaceIdOrId as string),
          eq(communities.id, spaceIdOrId as number)
        ),
      });
    });
    return successHandlerCallback(req, res, {
      message: "data updated successfully",
      data: updatedRecord,
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

export const getData = async (req: NextApiRequest) => {
  try {
    const { spaceIdOrId } = req.query as { spaceIdOrId: string | number };
    const community = await db.query.communities.findFirst({
      where: or(
        eq(communities.spaceId, spaceIdOrId as string),
        eq(communities.id, spaceIdOrId as number)
      ),
    });
    return community;
  } catch (error) {
    throw error;
  }
};
