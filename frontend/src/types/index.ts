export type APIResponse<T> = {
  data: T | null;
  message?: string;
};
export type USER = {
  id: number;
  address: string;
  chainId?: string;
  fullName?: string | null;
  role?: "admin" | "user";
  avatar?: string;
  authId?: string;
  username: string;
  userType?: USER_TYPE;
};
export type USER_TYPE = "member" | "nutritionist";
export type NEW_USER = Pick<
  USER,
  "address" | "chainId" | "fullName" | "avatar" | "authId" | "userType"
>;
export type MEETING = {
  id: number;
  roomId: string;
  title: string;
  userId?: string;
  participants?: number;
  creator?: {
    id: number;
    address: string;
    chainId?: number;
    authId: string;
  };
};
export type MEETING_RECORD = {
  id: number;
  meetingId?: number;
  roomId: string;
  recordDuration: number;
  userId?: string;
  recordUri: string;
};
export type NEW_MEETING_RECORD = Pick<
  MEETING_RECORD,
  "meetingId" | "recordDuration" | "recordUri" | "roomId" | "userId"
>;
export type NEW_MEETING = Pick<MEETING, "roomId" | "userId" | "title">;

export type TPeerMetadata = {
  displayName: string;
  address?: string;
  username?: string;
  avatar?: string;
  authId: string;
};
