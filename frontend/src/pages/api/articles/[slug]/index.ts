import { db } from "src/db";
import { articles } from "src/db/schema";
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
    let { slug, use_id } = req.query;

    const whereFilter =
      use_id == "true"
        ? { where: eq(articles.id, parseInt(slug as string, 10)) }
        : { where: eq(articles.slug, slug as string) };
    const article = await db.query.articles.findFirst({
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

    if (isEmpty(article)) {
      return await successHandlerCallback(
        req,
        res,
        {
          message: `Article with '${slug}' does not exist`,
          data: article,
        },
        404
      );
    }
    // update the views whenever a post is requested
    await db.update(articles).set({ views: (article?.views as number) + 1 });

    return await successHandlerCallback(req, res, {
      message: `Article retrieved successfully`,
      data: article,
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

    const article = await db.query.articles.findFirst({
      where: or(eq(articles.slug, slug as string)),
    });
    if (isEmpty(article)) {
      return await successHandlerCallback(
        req,
        res,
        {
          message: `Article with '${slug}' does not exist`,
          data: article,
        },
        404
      );
    }
    //TODO: add a check to see if the user is the author of the article

    if (status === "draft") {
      await db.update(articles).set({ ...rest, status });
      return await successHandlerCallback(req, res, {
        message: "Draft updated successfully",
      });
    }

    const update = await db.update(articles).set({ ...rest, status });

    return await successHandlerCallback(req, res, {
      message: "Article updated successfully",
    });
  } catch (error: any) {
    return await errorHandlerCallback(req, res, {
      message: "Something went wrong...",
    });
  }
};

// export function DELETE(req:NextApiRequest,res:NextApiResponse){

// }
