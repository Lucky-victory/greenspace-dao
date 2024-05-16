import PusherServer from "pusher";
import { ENV_CONFIG } from "src/config/constants";

let pusherInstance: PusherServer | null = null;

export const getPusherInstance = () => {
  if (!pusherInstance) {
    pusherInstance = new PusherServer({
      appId: ENV_CONFIG.PUSHER_APP_ID as string,
      key: ENV_CONFIG.PUSHER_KEY as string,
      secret: ENV_CONFIG.PUSHER_SECRET as string,
      cluster: ENV_CONFIG.PUSHER_CLUSTER as string,
      useTLS: true,
    });
  }
  return pusherInstance;
};
