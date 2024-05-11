import { db } from "src/db";
import { mealPlans } from "src/db/schema";
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
    let { slug } = req.query;

    const mealPlan = await db.query.mealPlans.findFirst({
      where: or(eq(mealPlans.slug, slug as string)),

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

    if (isEmpty(mealPlan)) {
      return await successHandlerCallback(
        req,
        res,
        {
          message: `meal Plan with '${slug}' does not exist`,
          data: mealPlan,
        },
        404
      );
    }
    // update the views whenever a post is requested
    await db.update(mealPlans).set({ views: (mealPlan?.views as number) + 1 });

    return await successHandlerCallback(req, res, {
      message: `meal Plan retrieved successfully`,
      data: mealPlan,
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
    const { status, ...rest } = req.body;
    let { slug } = req.query;

    const mealPlan = await db.query.mealPlans.findFirst({
      where: or(eq(mealPlans.slug, slug as string)),
    });
    if (isEmpty(mealPlan)) {
      return await successHandlerCallback(
        req,
        res,
        {
          message: `Meal plan with '${slug}' does not exist`,
          data: mealPlan,
        },
        404
      );
    }
    //TODO: add a check to see if the user is the author of the mealPlan

    if (status === "draft") {
      await db.update(mealPlans).set({ ...rest, status });
      return await successHandlerCallback(req, res, {
        message: "Draft updated successfully",
      });
    }

    const update = await db.update(mealPlans).set({ ...rest, status });

    return await successHandlerCallback(req, res, {
      message: "meal plan updated successfully",
    });
  } catch (error: any) {
    return await errorHandlerCallback(req, res, {
      message: "Something went wrong...",
    });
  }
};

// export function DELETE(req:NextApiRequest,res:NextApiResponse){

// }
