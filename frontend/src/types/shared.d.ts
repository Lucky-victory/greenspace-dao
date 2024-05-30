import { USER } from "src/state/types";

export type USER_TYPE = "member" | "nutritionist";
export type USER_ROLE = "user" | "admin";
export type PostStatus = "published" | "draft" | "deleted";
export type Timestamp = string | Date;
export interface Community {
  id: number;
  spaceId: string;
  status?: PostStatus;
  views: number;
  name: string;
  description?: string;
  visibility?: "public" | "private" | string;
  slug?: string;
  displayImage?: string;
  coverImage?: string;
  author: AUTHOR;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
export type NEW_COMMUNITY = Pick<
  Community,
  | "status"
  | "coverImage"
  | "description"
  | "displayImage"
  | "name"
  | "visibility"
>;
export type Article = {
  id: number;
  slug: string;
  title: string;
  content: string;
  image?: string;
  userId: string;
  status?: PostStatus;
  intro?: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  views?: number;
  author: AUTHOR;
};

export type NewArticle = Pick<
  Article,
  "slug" | "title" | "content" | "image" | "userId" | "intro" | "status"
>;
export type MealPlan = {
  id: number;
  slug: string;
  title: string;
  content: string;
  image?: string;
  userId: string;
  status?: PostStatus;
  intro?: string;
  views?: number;
  time: "breakfast" | "lunch" | "dinner" | "snack" | string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  author: AUTHOR;
};
export interface IUser {
  id: number;
  fullName: string;
  username: string;
  password?: string;
  email?: string;
  address: string;
  avatar?: string;
  userType: USER_TYPE;
  role?: USER_ROLE;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  chainId?: number;
}
export type NewUser = Pick<
  IUser,
  | "address"
  | "chainId"
  | "fullName"
  | "role"
  | "userType"
  | "username"
  | "password"
  | "avatar"
>;
export type NewMealPlan = Pick<
  MealPlan,
  | "slug"
  | "title"
  | "content"
  | "image"
  | "userId"
  | "intro"
  | "status"
  | "time"
>;
export type FitnessPlan = {
  id: number;
  slug: string;
  title: string;
  content: string;
  image?: string;
  userId: string;
  status?: PostStatus;
  intro?: string;
  views?: number;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  author: AUTHOR;
};
export type AUTHOR = {
  id: number;
  fullName?: string;
  username: string;
  address: string;
  authId: string;
  avatar?: string;
};
export type NewFitnessPlan = Pick<
  FitnessPlan,
  "slug" | "title" | "content" | "image" | "userId" | "intro" | "status"
>;

export type StateStatus = "loading" | "error" | "loaded";
export type APIResponse<T> = {
  data: T | null;
  message?: string;
};
export type APPOINTMENT_STATUS =
  | "pending"
  | "accepted"
  | "rejected"
  | "expired"
  | "completed";
