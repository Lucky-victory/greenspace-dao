import { db } from "src/db";
import { users } from "src/db/schema";
import { HTTP_METHOD_CB, errorHandlerCallback, mainHandler, successHandlerCallback } from "src/utils";
import { or, eq } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return mainHandler(req, res, {
    POST
  });
}

export const POST: HTTP_METHOD_CB = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { authId, email, address } = req.body;
    const whereConditions = [];

    if (authId) {
      whereConditions.push(eq(users.authId, authId as string));
    }
    if (email) {
      whereConditions.push(eq(users.email, email as string));
    }
    if (address) {
      whereConditions.push(eq(users.address, address as string));
    }

    if (whereConditions.length === 0) {
      return errorHandlerCallback(
        req,
        res,
        {
          message: "At least one of authId, email, or address must be provided",
          data: null,
          error: new Error("Missing required fields")
        },
        400
      );
    }

    const existingUser = await db.query.users.findFirst({
      where: or(...whereConditions)
    });

    const isNewUser = !existingUser;
    return successHandlerCallback(req, res, {
      message: isNewUser ? "User is new" : "User already exists",
      data: { isNewUser }
    });
  } catch (error) {
    return errorHandlerCallback(req, res, {
      message: "Something went wrong...",
      data: null,
      error
    });
  }
};
