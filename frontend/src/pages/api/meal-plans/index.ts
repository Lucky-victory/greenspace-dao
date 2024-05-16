import { db } from "src/db";
import { mealPlans } from "src/db/schema";
import {
  HTTP_METHOD_CB,
  errorHandlerCallback,
  mainHandler,
  successHandlerCallback,
} from "src/utils";
import { NextApiRequest, NextApiResponse } from "next";

import { IS_DEV } from "src/utils";
import { and, desc, eq, or } from "drizzle-orm";
import { PostStatus } from "src/types/shared";
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
            eq(mealPlans.status, "published"),
            eq(mealPlans.status, "draft")
          ),
        }
      : { where: eq(mealPlans.status, status as PostStatus) };
  if (status == "all" && authId) {
    whereFilter = {
      where: and(eq(mealPlans.userId, authId as string)),
    };
  } else if (authId && status !== "all") {
    whereFilter = {
      where: and(
        eq(mealPlans.status, status as PostStatus),
        eq(mealPlans.userId, authId as string)
      ),
    };
  }

  try {
    const allmealPlans = await db.query.mealPlans.findMany({
      orderBy: desc(mealPlans.createdAt),
      // where: eq(mealPlans.status, "published"),
      ...whereFilter,
      with: {
        author: {
          columns: {
            id: true,
            fullName: true,
            avatar: true,
            username: true,
            address: true,
            authId: true,
          },
        },
      },
    });
    return await successHandlerCallback(req, res, {
      message: "mealPlans retrieved successfully",
      data: allmealPlans,
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
      await db.insert(mealPlans).values({ ...rest, status });
      return await successHandlerCallback(req, res, {
        message: "Draft saved successfully",
      });
    }

    const createdMealplan = await db.transaction(async (tx) => {
      const [insertRes] = await tx
        .insert(mealPlans)
        .values({ ...rest, status });
      return await tx.query.mealPlans.findFirst({
        where: eq(mealPlans.id, insertRes.insertId),
        with: {
          author: {
            columns: {
              id: true,
              fullName: true,
              avatar: true,
              username: true,
              address: true,
              authId: true,
            },
          },
        },
      });
    });

    return await successHandlerCallback(
      req,
      res,
      {
        message: "Meal plan created successfully",
        data: createdMealplan,
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
