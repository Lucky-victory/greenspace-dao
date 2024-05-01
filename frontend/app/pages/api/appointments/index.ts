import { db } from "@/db";
import { appointments } from "@/db/schema";
import { APPOINTMENT_STATUS } from "@/types/shared";
import {
  HTTP_METHOD_CB,
  errorHandlerCallback,
  mainHandler,
  successHandlerCallback,
} from "@/utils";
import { and, eq, lt, lte } from "drizzle-orm";
import { timestamp } from "drizzle-orm/mysql-core";
import isEmpty from "just-is-empty";
import { NextApiRequest, NextApiResponse } from "next";

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
  try {
    const { status = "pending", nId, rId, filter } = req.query;
    let where;
    // filter appointments for today
    if (filter === "today") {
      if (!isEmpty(rId)) {
        where = {
          where: and(
            lte(appointments.startTime, new Date()),
            eq(appointments.requestedBy, rId as string),
            eq(appointments.status, status as APPOINTMENT_STATUS)
          ),
        };
      } else if (!isEmpty(nId)) {
        where = {
          where: and(
            lte(appointments.startTime, new Date()),
            eq(appointments.nutritionistId, nId as string),
            eq(appointments.status, status as APPOINTMENT_STATUS)
          ),
        };
      }
    }
    // if requestedBy Id was provided
    if (!isEmpty(rId) && isEmpty(nId)) {
      where = {
        where: and(
          eq(appointments.requestedBy, rId as string),
          eq(appointments.status, status as APPOINTMENT_STATUS)
        ),
      };
    }
    // if nutritionistId was provided
    if (!isEmpty(nId) && isEmpty(rId)) {
      where = {
        where: and(
          eq(appointments.requestedBy, rId as string),
          eq(appointments.status, status as APPOINTMENT_STATUS)
        ),
      };
    }
    const appointmentsResult = await db.query.appointments.findMany({
      ...where,
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
    return successHandlerCallback(req, res, {
      message: "Data retrieved successfully",
      data: appointmentsResult,
    });
  } catch (error) {
    return errorHandlerCallback(req, res, {
      message: "Something went wrong...",
      data: null,
    });
  }
};
export const POST: HTTP_METHOD_CB = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { startTime, endTime, ...data } = req.body;
    const createdAppointment = await db.transaction(async (tx) => {
      const [insertRes] = await tx
        .insert(appointments)
        .values({
          ...data,
          startTime: timestamp(startTime),
          endTime: timestamp(endTime),
        });
      const createdAppointment = await tx.query.appointments.findFirst({
        where: eq(appointments.id, insertRes.insertId),
        // with: {
        //   requestedBy: {
        //     columns: {
        //       id: true,
        //       authId: true,
        //       fullName: true,
        //       avatar: true,
        //       username: true,
        //       userType: true,
        //     },
        //   },
        //   nutritionist: {
        //     columns: {
        //       id: true,
        //       authId: true,
        //       fullName: true,
        //       avatar: true,
        //       username: true,
        //       userType: true,
        //     },
        //   },
        // },
      });
      return createdAppointment;
    });
    return successHandlerCallback(req, res, {
      message: "Appointment created successfully",
      data: createdAppointment,
    });
  } catch (error) {
    console.log({ error });

    return errorHandlerCallback(req, res, {
      message: "Something went wrong...",
      data: null,
      error,
    });
  }
};
