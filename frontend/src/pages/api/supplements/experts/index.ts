import { eq } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "src/db";
import { supplementExperts } from "src/db/schema";
import { HTTP_METHOD_CB, errorHandlerCallback, mainHandler, successHandlerCallback } from "src/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return mainHandler(req, res, {
    GET,
    POST,
  });
}

export const POST: HTTP_METHOD_CB = async (req, res) => {
  try {
    const { name, image } = req.body;
    const expert = await db.query.supplementExperts.findFirst({
      where: eq(supplementExperts.name, name),
    });
    if (expert) {
      return successHandlerCallback(req, res, {
        message: "expert already exists",
        data: expert,
      });
    }
    await db.insert(supplementExperts).values({
      name,
      image,
    });

    return successHandlerCallback(req, res, {
      message: "supplements expert created successfully",
    });
  } catch (error) {
    return errorHandlerCallback(req, res, {
      message: "Something went wrong...",
      data: null,
      error,
    });
  }
};

export const GET: HTTP_METHOD_CB = async (req, res) => {
  try {
    const experts = await db.query.supplementExperts.findMany();
    return successHandlerCallback(req, res, {
      message: "supplements expert created successfully",
      data: experts || null,
    });
  } catch (error) {
    return errorHandlerCallback(req, res, {
      message: "Something went wrong...",
      data: null,
      error,
    });
  }
};
