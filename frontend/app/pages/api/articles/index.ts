import { db } from "@/db";
import { articles } from "@/db/schema";
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
            eq(articles.status, "published"),
            eq(articles.status, "draft")
          ),
        }
      : { where: eq(articles.status, status as PostStatus) };
  if (status == "all" && authId) {
    whereFilter = {
      where: and(eq(articles.userId, authId as string)),
    };
  } else if (authId && status !== "all") {
    whereFilter = {
      where: and(
        eq(articles.status, status as PostStatus),
        eq(articles.userId, authId as string)
      ),
    };
  }

  try {
    const allArticles = await db.query.articles.findMany({
      ...whereFilter,
      orderBy: desc(articles.createdAt),
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
      message: "Articles retrieved successfully",
      data: allArticles,
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
      await db.insert(articles).values({ ...rest, status });
      return await successHandlerCallback(req, res, {
        message: "Draft saved successfully",
      });
    }

    const createdArticle = await db.transaction(async (tx) => {
      const [insertRes] = await tx.insert(articles).values({ ...rest, status });
      return await tx.query.articles.findFirst({
        where: eq(articles.id, insertRes.insertId),
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
        message: "Article created successfully",
        data: createdArticle,
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
