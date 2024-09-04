import { db } from "src/db";
import { users } from "src/db/schema";
import { HTTP_METHOD_CB, errorHandlerCallback, mainHandler, successHandlerCallback } from "src/utils";
import { NextApiRequest, NextApiResponse } from "next";

import { eq, or } from "drizzle-orm";

import isEmpty from "just-is-empty";
import { IS_DEV } from "src/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return mainHandler(req, res, {
    GET,
    PUT
  });
}

export const GET: HTTP_METHOD_CB = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let { addressOrAuthId } = req.query;

    const user = await db.query.users.findFirst({
      where: or(
        eq(users.username, addressOrAuthId as string),
        eq(users.authId, addressOrAuthId as string),
        eq(users.address, addressOrAuthId as string)
      )
    });

    if (isEmpty(user)) {
      return await successHandlerCallback(
        req,
        res,
        {
          message: `User with '${addressOrAuthId}' does not exist`,
          data: user
        },
        404
      );
    }
    return await successHandlerCallback(req, res, {
      message: `User retrieved successfully`,
      data: user
    });
  } catch (error: any) {
    return await errorHandlerCallback(req, res, {
      message: "Something went wrong...",
      error: IS_DEV ? { ...error } : null
    });
  }
};
export const PUT: HTTP_METHOD_CB = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { ...rest } = req.body;
    let { addressOrAuthId } = req.query;
    const whereCondition = or(
      eq(users.address, addressOrAuthId as string),
      eq(users.authId, addressOrAuthId as string)
    );
    const user = await db.query.users.findFirst({
      where: whereCondition
    });
    if (isEmpty(user)) {
      return await successHandlerCallback(
        req,
        res,
        {
          message: `User with '${addressOrAuthId}' does not exist`,
          data: user
        },
        404
      );
    }
    //TODO: Add authorization check
    const updatedRecord = await db.transaction(async (tx) => {
      await tx.update(users).set(rest).where(whereCondition);
      return tx.query.users.findFirst({
        where: whereCondition
      });
    });
    return await successHandlerCallback(req, res, {
      message: "user updated successfully",
      data: updatedRecord
    });
  } catch (error: any) {
    return await errorHandlerCallback(req, res, {
      message: "Something went wrong..."
    });
  }
};

// export function DELETE(req:NextApiRequest,res:NextApiResponse){

// }
