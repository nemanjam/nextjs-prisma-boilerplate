import { z } from 'zod';
import { isBrowser } from 'utils';

// it has default messages...
export const userLoginSchema = z.object({
  email: z.string().nonempty().email(),
  password: z.string().nonempty().min(3).max(20),
});

export const userRegisterSchema = userLoginSchema.extend({
  name: z.string().nonempty().min(3).max(15),
  username: z.string().nonempty().min(3).max(15),
});

export const userUpdateSchema = userRegisterSchema
  .extend({
    avatar: isBrowser() ? z.instanceof(FileList) : z.any(),
  })
  .omit({ email: true })
  .partial();

export const postCreateSchema = z.object({
  title: z.string().nonempty().min(6).max(100),
  content: z.string().nonempty().min(6).max(1000),
});

export const postUpdateSchema = postCreateSchema
  .extend({
    published: z.boolean(),
  })
  .partial();
