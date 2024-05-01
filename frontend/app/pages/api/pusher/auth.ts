// TODO: implement authentication and authorization logic
import { getPusherInstance } from "@/lib/pusher/server";
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
    // GET,
    POST,
  });
}
const pusherServer = getPusherInstance();

export const POST: HTTP_METHOD_CB = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  console.log("authenticating pusher perms...");
  const data = await req.body;
  const [socketId, channelName] = data
    .split("&")
    .map((str: string) => str.split("=")[1]);

  // logic to check user permissions

  const authResponse = pusherServer.authorizeChannel(socketId, channelName);

  return successHandlerCallback(req, res, {
    data: JSON.stringify(authResponse),
  });
};
// export const noop=()=>{}
