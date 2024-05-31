import { eq } from "drizzle-orm";
import isEmpty from "just-is-empty";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "src/db";
import { nutritionists } from "src/db/schema";
import { VerificationStatus } from "src/state/types";
import { HTTP_METHOD_CB, mainHandler, successHandlerCallback } from "src/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return mainHandler(req, res, {
    POST,
  });
}
export const POST: HTTP_METHOD_CB = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const data = req.body as { address: string };
    const response = await db.query.nutritionists.findFirst({
      where: eq(nutritionists.address, data.address),
    });
    if (isEmpty(response)) {
      return await successHandlerCallback(req, res, {
        message: `Nutritionist with '${data.address}' does not exist`,
        data: response,
      });
    }
    return await successHandlerCallback(req, res, {
      message: `Nutritionist status retrieved successfully`,
      data: {
        status: response?.verificationStatus as VerificationStatus,
      },
    });
  } catch (error) {}
};
