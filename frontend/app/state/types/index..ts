export type APIResponse<T> = {
  data: T | null;
  message?: string;
};
export type USERS = {
  id: number;
  address: string;
  chainId?: string;
  fullName?: string | null;
  role?: "admin" | "user";
  avatarUrl?: string;
  authId?: string;
};
export type NEW_USER = Pick<
  USERS,
  "address" | "chainId" | "fullName" | "avatarUrl" | "authId"
>;
export type MEETINGS = {
  id: number;
  roomId: string;
  title: string;
  authId?: string;
  participants?: number;
  creator?: {
    id: number;
    address: string;
    chainId?: number;
    authId: string;
  };
};
export type MEETING_RECORDS = {
  id: number;
  meetingId?: number;
  roomId: string;
  recordDuration: number;
  authId?: string;
  recordUri: string;
};
export type NEW_MEETING_RECORDS = Pick<
  MEETING_RECORDS,
  "meetingId" | "recordDuration" | "recordUri" | "roomId" | "authId"
>;
export type NEW_MEETING = Pick<MEETINGS, "roomId" | "authId" | "title">;
// export type UserSession = DefaultSession & {
//   address: string;
//   chainId?: number;
//   user: {
//     id: number;
//     avatarUrl?: string;
//     fullName?: string;
//     address?: string;
//   };
// };
