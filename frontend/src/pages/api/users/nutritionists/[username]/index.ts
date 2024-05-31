import { db } from "src/db";
import { nutritionists } from "src/db/schema";
import {
  HTTP_METHOD_CB,
  errorHandlerCallback,
  mainHandler,
  successHandlerCallback,
} from "src/utils";
import { NextApiRequest, NextApiResponse } from "next";

import { eq, or } from "drizzle-orm";

import isEmpty from "just-is-empty";
import { IS_DEV } from "src/utils";

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
    let { username } = req.query;

    const nutritionist = await db.query.nutritionists.findFirst({
      where: or(
        eq(nutritionists.username, username as string),
        eq(nutritionists.authId, username as string),
        eq(nutritionists.address, username as string)
      ),
    });

    if (isEmpty(nutritionist)) {
      return await successHandlerCallback(
        req,
        res,
        {
          message: `nutritionist with '${username}' does not exist`,
          data: nutritionist,
        },
        404
      );
    }
    return await successHandlerCallback(req, res, {
      message: `nutritionist retrieved successfully`,
      data: nutritionist,
    });
  } catch (error: any) {
    return await errorHandlerCallback(req, res, {
      message: "Something went wrong...",
      error: IS_DEV ? { ...error } : null,
    });
  }
};
export const PUT: HTTP_METHOD_CB = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { ...rest } = req.body;
    let { username } = req.query;

    const nutritionist = await db.query.nutritionists.findFirst({
      where: or(
        eq(nutritionists.username, username as string),
        eq(nutritionists.authId, username as string),
        eq(nutritionists.address, username as string)
      ),
    });
    if (isEmpty(nutritionist)) {
      return await successHandlerCallback(
        req,
        res,
        {
          message: `nutritionist with '${username}' does not exist`,
          data: nutritionist,
        },
        404
      );
    }
    //TODO: Add authorization check
    const updatedRecord = await db.transaction(async (tx) => {
      await tx
        .update(nutritionists)
        .set(rest)
        .where(
          or(
            eq(nutritionists.username, username as string),
            eq(nutritionists.authId, username as string)
          )
        );
      return tx.query.nutritionists.findFirst({
        where: eq(nutritionists.username, username as string),
      });
    });
    return await successHandlerCallback(req, res, {
      message: "nutritionist updated successfully",
      data: updatedRecord,
    });
  } catch (error: any) {
    return await errorHandlerCallback(req, res, {
      message: "Something went wrong...",
    });
  }
};

// export function DELETE(req:NextApiRequest,res:NextApiResponse){

// }
