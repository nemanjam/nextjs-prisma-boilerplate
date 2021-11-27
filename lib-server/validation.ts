import { z } from 'zod';

export const userLoginSchema = z.object({
  email: z
    .string()
    .nonempty({ message: 'Can not be empty' })
    .email({ message: 'Invalid email address' }), // maybe it has default messages...
  password: z.string().nonempty({ message: 'Can not be empty' }).min(3).max(20),
});

export const userRegisterSchema = userLoginSchema.extend({
  name: z.string().nonempty().min(6).max(15),
  username: z.string().nonempty().min(6).max(15),
});

export const userUpdateSchema = userRegisterSchema.partial();

export const postCreateSchema = z.object({
  title: z.string().nonempty().min(6).max(100),
  content: z.string().nonempty().min(6).max(1000),
});

export const postUpdateSchema = postCreateSchema
  .extend({
    published: z.boolean(),
  })
  .partial();
