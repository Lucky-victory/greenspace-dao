import { db } from "src/db";
import { nutritionists, users } from "src/db/schema";
import {
  HTTP_METHOD_CB,
  errorHandlerCallback,
  filterNullOrEmpty,
  mainHandler,
  successHandlerCallback,
} from "src/utils";
import { and, eq, or } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";
import { VerificationStatus } from "src/state/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return mainHandler(req, res, {
    GET,
    POST,
  });
}

export const GET: HTTP_METHOD_CB = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { status = "verified" } = req.query;

    const verificationStatus = status as VerificationStatus;

    const nutritionists = await db.query.nutritionists.findMany({
      columns: {
        email: false,
      },
      ...(status !== "all" && {
        where(fields, operators) {
          return operators.eq(fields.verificationStatus, verificationStatus);
        },
      }),
    });
    return successHandlerCallback(req, res, {
      message: "nutritionists retrieved successfully",
      data: nutritionists || null,
    });
  } catch (error) {
    return errorHandlerCallback(req, res, {
      message: "Something went wrong...",
      data: null,
    });
  }
};
export const POST: HTTP_METHOD_CB = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { authId, email, address, birthDate, ...data } = req.body;
    const existingNutritionist = await db.query.nutritionists.findFirst({
      where: or(
        eq(nutritionists.email, email as string),
        eq(nutritionists.authId, authId as string),
        eq(nutritionists.address, address as string)
      ),
    });
    if (existingNutritionist) {
      const nutritionist = await db.transaction(async (tx) => {
        await tx
          .update(nutritionists)
          .set(
            filterNullOrEmpty({
              ...data,
              address,
              email,
              authId,
              birthDate: new Date(birthDate),
            })
          )
          .where(eq(nutritionists.id, existingNutritionist.id));

        const updatedNutritionist = await tx.query.nutritionists.findFirst({
          where: eq(nutritionists.id, existingNutritionist.id),
        });
        return updatedNutritionist;
      });
      return successHandlerCallback(req, res, {
        message: "nutritionist already exists",
        data: nutritionist,
      });
    }
    const nutritionist = await db.transaction(async (tx) => {
      const [insertRes] = await tx.insert(nutritionists).values({
        ...data,
        address,
        email,
        authId,
        birthDate: new Date(birthDate),
      });

      const createdNutritionist = await tx.query.nutritionists.findFirst({
        where: eq(nutritionists.id, insertRes.insertId),
      });
      return createdNutritionist;
    });
    return successHandlerCallback(req, res, {
      message: "nutritionist created successfully",
      data: nutritionist,
    });
  } catch (error) {
    return errorHandlerCallback(req, res, {
      message: "Something went wrong...",
      data: null,
      error,
    });
  }
};
