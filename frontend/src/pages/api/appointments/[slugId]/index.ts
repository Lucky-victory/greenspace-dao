import { db } from "src/db";
import { appointments } from "src/db/schema";
import {
  HTTP_METHOD_CB,
  errorHandlerCallback,
  mainHandler,
  successHandlerCallback,
} from "src/utils";
import { eq, or } from "drizzle-orm";
import isEmpty from "just-is-empty";
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

    const appointment = await db.query.appointments.findFirst({
      where: or(eq(appointments.slugId, slugId)),
      with: {
        requestedBy: {
          columns: {
            id: true,
            authId: true,
            fullName: true,
            avatar: true,
            username: true,
            userType: true,
          },
        },
        nutritionist: {
          columns: {
            id: true,
            authId: true,
            fullName: true,
            avatar: true,
            username: true,
            userType: true,
          },
        },
      },
    });
    if (isEmpty(appointment)) {
      return await successHandlerCallback(
        req,
        res,
        {
          message: `appointment with '${slugId}' does not exist`,
          data: appointment,
        },
        404
      );
    }
    return successHandlerCallback(req, res, {
      message: "appointment retrieved successfully",
      data: appointment,
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
//       const [insertRes] = await tx.insert(appointments).values(data);

//       return tx.query.appointments.findFirst({
//         where: eq(appointments.id, insertRes.insertId),
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
