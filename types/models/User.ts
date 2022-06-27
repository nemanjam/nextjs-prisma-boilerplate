import { User } from '@prisma/client';
import { Dispatch, SetStateAction } from 'react';
import { RequiredNotNull, SortDirection } from 'types';

// --------- Response types ----------
// used in queries and api responses

/**
 * user without password
 */
export type ClientUser = Omit<User, 'password'>;

// --------- Request types ----------
// used in mutations and api arguments

/**
 * create user, password is required
 */
export type UserCreateData = RequiredNotNull<
  Pick<User, 'name' | 'username' | 'email' | 'password'>
>;

export type UserCreateFormData = {
  email: string;
  password: string;
  confirmPassword?: string;
  name?: string;
  username?: string;
};

/**
 * update user
 */
export type UserUpdateData = Partial<Omit<UserUpdateFormData, 'confirmPassword'>>;

// for indexing with []
export type UserUpdateDataKeys = keyof UserUpdateData;

export type UserUpdateMutationData = {
  id: string;
  user: UserUpdateData;
  setProgress: Dispatch<SetStateAction<number>>;
};

// don't put id in form, validation needs to diff on client and server
// id is in route param
export type UserUpdateFormData = {
  name: string;
  username: string;
  avatar: File | null;
  header: File | null;
  bio: string;
  password: string;
  confirmPassword: string;
};

// updateUser service on server
export type UserUpdateServiceData = Partial<{
  name: string;
  username: string;
  bio: string;
  password: string;
  files: any; // this is different
}>;

// --------- Query params request types ----------
// used in queries and api args validation

export type UsersGetData = Partial<{
  page: number;
  limit: number;
  searchTerm: string;
  sortDirection: SortDirection;
}>;

export type UserGetData = Partial<{
  id: string;
  username: string;
  email: string;
}>;

// --------- NextAuth authorize() callback args types ----------

export type UserLoginData = {
  email: string;
  password: string;
};
