import { appointments } from "src/db/schema";

export type APIResponse<T = null> = {
  data: T;
  message?: string;
  error?: any;
};

export type Sex = "male" | "female" | "other";

export type VerificationStatus = "verified" | "pending" | "rejected";

export type Nutritionist = {
  fullName: string;
  country: string;
  bio?: string;
  id: number;
  city?: string;
  verificationStatus: VerificationStatus;
  sex: Sex;
  address: string;
  avatar?: string;
  authId?: string;
  email: string;
  emailVerified?: boolean;
  username: string;
  birthDate: string | Date;
  credentialsCid?: string;
};
export type NEW_NUTRITIONIST = Pick<
  Nutritionist,
  | "address"
  | "authId"
  | "emailVerified"
  | "email"
  | "fullName"
  | "sex"
  | "city"
  | "country"
  | "birthDate"
  | "credentialsCid"
>;

export type MEETING = {
  id: number;
  roomId: string;
  title: string;
  userId?: string;
  participants?: number;
  author?: {
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
  avatarUrl?: string;
};
export type NewAppointment = Pick<
  typeof appointments.$inferInsert,
  "duration" | "endTime" | "nutritionistId" | "requestedBy" | "startTime"
>;
