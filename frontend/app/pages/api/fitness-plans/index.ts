import { db } from "@/db";
import { fitnessPlans } from "@/db/schema";
import {
  HTTP_METHOD_CB,
  errorHandlerCallback,
  mainHandler,
  successHandlerCallback,
} from "@/utils";
import { NextApiRequest, NextApiResponse } from "next";

import { IS_DEV } from "@/utils";
import { and, desc, eq, or } from "drizzle-orm";
import { PostStatus } from "@/types/shared";
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb",
    },
  },
};
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
  const { status = "published", authId } = req.query;
  let whereFilter =
    status == "all"
      ? {
          where: or(
            eq(fitnessPlans.status, "published"),
            eq(fitnessPlans.status, "draft")
          ),
        }
      : { where: eq(fitnessPlans.status, status as PostStatus) };
  if (status == "all" && authId) {
    whereFilter = {
      where: and(eq(fitnessPlans.userId, authId as string)),
    };
  } else if (authId && status !== "all") {
    whereFilter = {
      where: and(
        eq(fitnessPlans.status, status as PostStatus),
        eq(fitnessPlans.userId, authId as string)
      ),
    };
  }

  try {
    const allfitnessPlans = await db.query.fitnessPlans.findMany({
      ...whereFilter,
      orderBy: desc(fitnessPlans.createdAt),
      with: {
        author: {
          columns: {
            id: true,
            fullName: true,
            avatar: true,
            username: true,
            address: true,
          },
        },
      },
    });
    return await successHandlerCallback(req, res, {
      message: "fitnessPlans retrieved successfully",
      data: allfitnessPlans,
    });
  } catch (error: any) {
    return await errorHandlerCallback(req, res, {
      message: "Something went wrong...",
      error: IS_DEV ? { ...error } : null,
    });
  }
};
export const POST: HTTP_METHOD_CB = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { status, ...rest } = req.body;

    if (status === "draft") {
      await db.insert(fitnessPlans).values({ ...rest, status });
      return await successHandlerCallback(req, res, {
        message: "Draft saved successfully",
      });
    }

    const createdMealPlan = await db.transaction(async (tx) => {
      const [insertRes] = await tx
        .insert(fitnessPlans)
        .values({ ...rest, status });
      return await tx.query.fitnessPlans.findFirst({
        where: eq(fitnessPlans.id, insertRes.insertId),
      });
    });

    return await successHandlerCallback(
      req,
      res,
      {
        message: "Fitness plan created successfully",
        data: createdMealPlan,
      },
      201
    );
  } catch (error: any) {
    return await errorHandlerCallback(req, res, {
      message: "Something went wrong...",
      error: IS_DEV ? { ...error } : null,
    });
  }
};
