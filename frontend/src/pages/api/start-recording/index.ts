import type { NextApiRequest, NextApiResponse } from "next";
import { Recorder } from "@huddle01/server-sdk/recorder";
import { AccessToken, Role } from "@huddle01/server-sdk/auth";
import { ENV_CONFIG } from "src/config/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { roomId } = req.query;

  //checking for project credentials
  if (!ENV_CONFIG.HUDDLE_PROJECT_ID && !ENV_CONFIG.HUDDLE_API_KEY) {
    return res
      .status(400)
      .json({ error: "PROJECT_ID and API_KEY are required" });
  }

  //creating the Recorder class instance
  const recorder = new Recorder(
    ENV_CONFIG.HUDDLE_PROJECT_ID!,
   ENV_CONFIG.HUDDLE_API_KEY!
  );

  //generating an access token for the recorder
  const token = new AccessToken({
    apiKey: ENV_CONFIG.HUDDLE_API_KEY!,
    roomId: roomId as string,
    role: Role.BOT,
    permissions: {
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
    },
  });

  const accessToken = await token.toJwt();

  //starting the recording
  const recording = await recorder.startRecording({
    roomId: roomId as string,
    token: accessToken,
  });

  console.log("recording", recording);

  return res.status(200).json({ recording });
}
