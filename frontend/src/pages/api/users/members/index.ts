import { db } from "src/db";
import { HTTP_METHOD_CB, errorHandlerCallback, mainHandler, successHandlerCallback } from "src/utils";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return mainHandler(req, res, {
    GET
  });
}

export const GET: HTTP_METHOD_CB = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const users = await db.query.users.findMany({
      columns: {
        email: false
      }
    });
    return successHandlerCallback(req, res, {
      message: "member users retrieved successfully",
      data: users || []
    });
  } catch (error) {
    return errorHandlerCallback(req, res, {
      message: "Something went wrong...",
      data: null
    });
  }
};
