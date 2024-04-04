export type Article = {
  id: number;
  slug: string;
  title: string;
  content: string;
  image?: string;
  authorAddress: string;
  status?: PostStatus;
  intro?: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
  views?: number;
  author: {
    id: number;
    fullName?: string;
    username: string;
    address: string;

    avatar?: string;
  };
};
export type PostStatus = 'published' | 'draft' | 'deleted';

export type NewArticle = Pick<
  Article,
  'slug' | 'title' | 'content' | 'image' | 'authorAddress' | 'intro' | 'status'
>;
export type MealPlan = {
  id: number;
  slug: string;
  title: string;
  content: string;
  image?: string;
  authorAddress: string;
  status?: PostStatus;
  intro?: string;
  views?: number;
  time: 'breakfast' | 'lunch' | 'dinner' | 'snack' | string;
  createdAt: string | Date;
  updatedAt?: string | Date;
  author: {
    id: number;
    fullName?: string;
    username: string;
    address: string;

    avatar?: string;
  };
};
export type USER_TYPE = 'member' | 'nutritionist';
export type USER_ROLE = 'user' | 'admin';
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
  createdAt: string | Date;
  updatedAt?: string | Date;
  chainId?: number;
}
export type NewUser = Pick<
  IUser,
  | 'address'
  | 'chainId'
  | 'fullName'
  | 'role'
  | 'userType'
  | 'username'
  | 'password'
  | 'avatar'
>;
export type NewMealPlan = Pick<
  MealPlan,
  | 'slug'
  | 'title'
  | 'content'
  | 'image'
  | 'authorAddress'
  | 'intro'
  | 'status'
  | 'time'
>;
export type FitnessPlan = {
  id: number;
  slug: string;
  title: string;
  content: string;
  image?: string;
  authorAddress: string;
  status?: PostStatus;
  intro?: string;
  views?: number;
  createdAt: string | Date;
  updatedAt?: string | Date;
  author: {
    id: number;
    fullName?: string;
    username: string;
    address: string;

    avatar?: string;
  };
};
export type NewFitnessPlan = Pick<
  FitnessPlan,
  'slug' | 'title' | 'content' | 'image' | 'authorAddress' | 'intro' | 'status'
>;

export type StateStatus = 'loading' | 'error' | 'loaded';
export type APIResponse<T> = {
  data: T | null;
  message?: string;
};
