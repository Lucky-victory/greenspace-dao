import PusherClient from "pusher-js";
import { ENV_CONFIG } from "src/config/constants";
export const pusherClient = new PusherClient(
  ENV_CONFIG.PUSHER_KEY as string,
  {
    cluster: ENV_CONFIG.PUSHER_CLUSTER as string,
    authEndpoint: "/api/pusher/auth",
  }
);
