import { db } from "@/db";
import { communityChallenges } from "@/db/schema";
import {
  HTTP_METHOD_CB,
  errorHandlerCallback,
  mainHandler,
  successHandlerCallback,
} from "@/utils";
import { eq, or } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return mainHandler(req, res, {
    GET,
  });
}

export const GET: HTTP_METHOD_CB = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { slugId } = req.query as { slugId: string };

    const challenge = await db.query.communityChallenges.findFirst({
      where: or(eq(communityChallenges.slugId, slugId)),
      with: {
        tags: {
          columns: {
            createdAt: false,
            updatedAt: false,
          },
        },
      },
    });

    return successHandlerCallback(req, res, {
      message: "challenge retrieved successfully",
      data: challenge,
    });
  } catch (error) {
    return errorHandlerCallback(req, res, {
      message: "Something went wrong...",
      data: null,
    });
  }
};

// export const POST: HTTP_METHOD_CB = async (
//   req: NextApiRequest,
//   res: NextApiResponse
// ) => {
//   try {
//     const data = req.body;

//     const createdRecord = await db.transaction(async (tx) => {
//       const [insertRes] = await tx.insert(communityEvents).values(data);

//       return tx.query.communityEvents.findFirst({
//         where: eq(communityEvents.id, insertRes.insertId),
//       });
//     });
//     return successHandlerCallback(req, res, {
//       message: "Event added successfully",
//       data: createdRecord,
//     });
//   } catch (error) {
//     return errorHandlerCallback(req, res, {
//       message: "Something went wrong...",
//       data: null,
//       error,
//     });
//   }
// };
