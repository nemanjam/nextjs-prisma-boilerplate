import { z } from 'zod';
import { isBrowser } from 'utils';
import ApiError from 'lib-server/error';
import { PostsGetSearchQueryParams } from 'types/models/Post';
import { UserGetQueryParams, UsersGetSearchQueryParams } from 'types/models/User';
import { QueryParamsType } from 'types';

const passwordMin = 6,
  passwordMax = 20,
  nameMin = 3,
  nameMax = 25,
  usernameMin = 3,
  usernameMax = 15,
  bioMax = 300;

export const userGetSchema = z
  .object({
    id: z.string().cuid().optional().or(z.literal('')),
    email: z.string().email().optional().or(z.literal('')),
    username: z.string().min(usernameMin).max(usernameMax).optional().or(z.literal('')),
  })
  .refine(
    (data) => data.id || data.username || data.email, // false triggers message
    'Either id, username or email should be specified.'
  );

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(passwordMin).max(passwordMax),
});

export const userRegisterSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(passwordMin).max(passwordMax),
    // +
    confirmPassword: z.string().optional().or(z.literal('')),
    name: z.string().min(nameMin).max(nameMax),
    username: z.string().min(usernameMin).max(usernameMax),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

export const userUpdateSchema = z
  .object({
    password: z.string().min(passwordMin).max(passwordMax).optional().or(z.literal('')),
    // +
    confirmPassword: z.string().optional().or(z.literal('')),
    name: z.string().min(nameMin).max(nameMax).optional().or(z.literal('')),
    username: z.string().min(usernameMin).max(usernameMax).optional().or(z.literal('')),
    bio: z.string().max(bioMax).optional().or(z.literal('')),
    avatar: isBrowser()
      ? z.instanceof(Blob).refine((file) => file?.size <= 1024 * 1024, {
          message: 'Avatar size must be less than 1MB.', // no minSize google, fb...
        })
      : z.any(),
    header: isBrowser()
      ? z.instanceof(Blob).refine((file) => file?.size <= 1024 * 1024 * 2, {
          message: 'Header image size must be less than 2MB.',
        })
      : z.any(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

// query params numbers are strings, parse them before validating
const stringToNumber = (numberStr: string): number | void => {
  return numberStr ? parseInt(z.string().parse(numberStr), 10) : undefined;
};

const stringToBoolean = (booleanStr: string): boolean | void => {
  return booleanStr ? z.string().parse(booleanStr) === 'true' : undefined;
};

const usersLimitMax = 100;

export const usersGetSchema = z.object({
  page: z.preprocess(stringToNumber, z.number().min(1).optional()),
  limit: z.preprocess(stringToNumber, z.number().min(1).max(usersLimitMax).optional()),
  searchTerm: z.string().optional().or(z.literal('')),
  sortDirection: z
    .string()
    .optional()
    .or(z.literal(''))
    .or(z.literal('asc'))
    .or(z.literal('desc')),
});

// ----------- manual validation with safeParse() -------------

export const validateUserIdCuid = (id: string): string => {
  const result = userIdCuidSchema.safeParse({ id });
  if (!result.success) throw ApiError.fromZodError((result as any).error);

  return result.data.id;
};

// 1 user
export const validateUserSearchQueryParams = (
  params: QueryParamsType
): UserGetQueryParams => {
  const result = userGetSchema.safeParse(params);
  if (!result.success) throw ApiError.fromZodError((result as any).error);

  return result.data as UserGetQueryParams;
};

// n users, unused
export const validateUsersSearchQueryParams = (
  params: QueryParamsType
): UsersGetSearchQueryParams => {
  const result = usersGetSchema.safeParse(params);
  if (!result.success) throw ApiError.fromZodError((result as any).error);

  return result.data as UsersGetSearchQueryParams;
};

// --------------- post ---------------

const titleMin = 6,
  titleMax = 100,
  contentMin = 6,
  contentMax = 1000;

export const postCreateSchema = z.object({
  title: z.string().min(titleMin).max(titleMax),
  content: z.string().min(contentMin).max(contentMax),
});

export const postUpdateSchema = z.object({
  title: z.string().min(titleMin).max(titleMax).optional().or(z.literal('')),
  content: z.string().min(contentMin).max(contentMax).optional().or(z.literal('')),
  // +
  published: z.boolean().optional(),
});

const postsLimitMax = 100;

export const postsGetSchema = z.object({
  page: z.preprocess(stringToNumber, z.number().min(1).optional()),
  limit: z.preprocess(stringToNumber, z.number().min(1).max(postsLimitMax).optional()),
  searchTerm: z.string().optional().or(z.literal('')),
  userId: z.string().cuid().optional().or(z.literal('')),
  email: z.string().email().optional().or(z.literal('')),
  username: z.string().optional().or(z.literal('')),
  sortDirection: z
    .string()
    .optional()
    .or(z.literal(''))
    .or(z.literal('asc'))
    .or(z.literal('desc')),
  published: z.preprocess(stringToBoolean, z.boolean().optional()),
});

const searchMin = 3,
  searchMax = 20;

export const postSearchSchema = z.object({
  search: z.string().min(searchMin).max(searchMax).optional().or(z.literal('')),
});

const numberIdMax = 10 ** 20;

export const postIdNumberSchema = z.object({
  id: z.number().int().lte(numberIdMax), // id: number, not a string
});

export const userIdCuidSchema = z.object({
  id: z.string().cuid(),
});

// ----------- manual validation with safeParse() -------------

export const validatePostIdNumber = (id: string): number => {
  const result = postIdNumberSchema.safeParse({ id });
  if (!result.success) throw ApiError.fromZodError((result as any).error);

  return result.data.id;
};

export const validatePostsSearchQueryParams = (
  params: QueryParamsType | PostsGetSearchQueryParams
): PostsGetSearchQueryParams => {
  const result = postsGetSchema.safeParse(params);
  if (!result.success) throw ApiError.fromZodError((result as any).error);

  return result.data as PostsGetSearchQueryParams;
};
