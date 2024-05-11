import { db } from "src/db";
import { fitnessPlans } from "src/db/schema";
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

const MAX_LOCKED_CONTENT_LENGTH = 200;
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

    const fitnessPlan = await db.query.fitnessPlans.findFirst({
      where: or(eq(fitnessPlans.slug, slug as string)),

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

    if (isEmpty(fitnessPlan)) {
      return await successHandlerCallback(
        req,
        res,
        {
          message: `Fitness Plan with '${slug}' does not exist`,
          data: fitnessPlan,
        },
        404
      );
    }
    // update the views whenever a post is requested
    await db
      .update(fitnessPlans)
      .set({ views: (fitnessPlan?.views as number) + 1 });

    return await successHandlerCallback(req, res, {
      message: `Fitness Plan retrieved successfully`,
      data: fitnessPlan,
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

    const fitnessPlan = await db.query.fitnessPlans.findFirst({
      where: or(eq(fitnessPlans.slug, slug as string)),
    });
    if (isEmpty(fitnessPlan)) {
      return await successHandlerCallback(
        req,
        res,
        {
          message: `Fitness plan with '${slug}' does not exist`,
          data: fitnessPlan,
        },
        404
      );
    }
    //TODO: add a check to see if the user is the author of the fitnessPlan

    if (status === "draft") {
      await db.update(fitnessPlans).set({ ...rest, status });
      return await successHandlerCallback(req, res, {
        message: "Draft updated successfully",
      });
    }

    const update = await db.update(fitnessPlans).set({ ...rest, status });

    return await successHandlerCallback(req, res, {
      message: "Fitness plan updated successfully",
    });
  } catch (error: any) {
    return await errorHandlerCallback(req, res, {
      message: "Something went wrong...",
    });
  }
};

// export function DELETE(req:NextApiRequest,res:NextApiResponse){

// }
