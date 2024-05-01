import type { NextApiRequest, NextApiResponse } from "next";
import { AccessToken, Role } from "@huddle01/server-sdk/auth";
// Opt out of caching for all data requests in the route segment
export const dynamic = "force-dynamic";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { roomId, isCreator } = req.query;
  const { metadata = {} } = req.body;
  try {
    if (!roomId) {
      return res.status(400).json({ error: "roomId is required" });
    }
    let token = "";

    const isRoomCreator = isCreator == "true";

    let role;
    let permissions;

    if (isRoomCreator) {
      // Room creator
      role = Role.HOST;
      permissions = {
        admin: true,
        canConsume: true,
        canProduce: true,
        canProduceSources: {
          cam: true,
          mic: true,
          screen: true,
        },
        canRecvData: true,
        canSendData: true,
        canUpdateMetadata: true,
      };
    } else {
      role = Role.LISTENER;

      permissions = {
        admin: false,
        canConsume: true,
        canProduce: true,
        canProduceSources: {
          cam: true,
          mic: true,
          screen: true,
        },
        canRecvData: true,
        canSendData: true,
        canUpdateMetadata: true,
      };
    }

    const accessToken = new AccessToken({
      apiKey: process.env.HUDDLE_API_KEY!,
      roomId: roomId as string,
      options: { metadata: metadata },
      role,
      permissions,
    });

    token = await accessToken.toJwt();

    // const accessToken = new AccessToken({
    //   apiKey: process.env.HUDDLE_API_KEY!,
    //   roomId: roomId as string,
    //   options: { metadata: metadata },
    //   role: Role.HOST,
    //   permissions: {
    //     admin: true,
    //     canConsume: true,
    //     canProduce: true,
    //     canProduceSources: {
    //       cam: true,
    //       mic: true,
    //       screen: true,
    //     },
    //     canRecvData: true,
    //     canSendData: true,
    //     canUpdateMetadata: true,
    //   },
    // });
    return res.status(200).json({ data: { token, roomId, metadata } });
  } catch (error) {
    return res
      .status(500)
      .json({ data: { message: "Something went wrong..." }, error });
  }
}
