import { User } from '@prisma/client';
import { Dispatch, SetStateAction } from 'react';

// --------- Response types ----------
// used in queries and api responses

/**
 * user without password
 */
export type ClientUser = Omit<User, 'password'>;

// --------- Request types ----------
// used in mutations and api arguments

/**
 * create user
 */
export type UserCreateData = Pick<User, 'name' | 'username' | 'email' | 'password'>;

export interface UserCreateFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  name?: string;
  username?: string;
}

/**
 * update user
 */
export type UserUpdateData = Partial<
  Pick<User, 'username' | 'name' | 'bio' | 'image' | 'headerImage' | 'password'>
>;

export type UserUpdateMutationData = {
  id: string;
  user: UserUpdateData;
  setProgress: Dispatch<SetStateAction<number>>;
};

// don't put id in form, validation needs to diff on client and server
// id is in route param
export interface UserUpdateFormData {
  name: string;
  username: string;
  avatar: File;
  header: File;
  bio: string;
  password: string;
  confirmPassword: string;
}
