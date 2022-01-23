import { z } from 'zod';
import { isBrowser } from 'utils';

const passwordMin = 3,
  passwordMax = 20,
  nameMin = 3,
  nameMax = 15,
  usernameMin = 3,
  usernameMax = 15,
  bioMax = 200;

export const userGetSchema = z
  .object({
    email: z.string().email(),
    username: z.string().min(usernameMin).max(usernameMax),
  })
  .refine(
    (data) => data.email || data.username, // false triggers message
    'Either email or username should be filled in.'
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
  .refine((data) => data.password === data.confirmPassword, {
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
      ? z.instanceof(File).refine((file) => file.size <= 1024 * 1024, {
          message: 'Avatar size must be less than 1MB.', // no minSize google, fb...
        })
      : z.any(),
    header: isBrowser()
      ? z.instanceof(File).refine((file) => file.size <= 1024 * 1024 * 2, {
          message: 'Header image size must be less than 2MB.',
        })
      : z.any(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

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

// query params numbers are strings, parse them before validating
const stringToNumber = (numberStr: string): number | void => {
  return numberStr ? parseInt(z.string().parse(numberStr), 10) : undefined;
};

const maxLimit = 100;

export const postsGetSchema = z.object({
  page: z.preprocess(stringToNumber, z.number().min(1).optional()),
  limit: z.preprocess(stringToNumber, z.number().min(1).max(maxLimit).optional()),
  searchTerm: z.string().optional().or(z.literal('')),
  username: z.string().optional().or(z.literal('')),
  sortField: z
    .string()
    .optional()
    .or(z.literal(''))
    .or(z.literal('updatedAt'))
    .or(z.literal('title'))
    .or(z.literal('name')),
  sortDirection: z
    .string()
    .optional()
    .or(z.literal(''))
    .or(z.literal('asc'))
    .or(z.literal('desc')),
});
