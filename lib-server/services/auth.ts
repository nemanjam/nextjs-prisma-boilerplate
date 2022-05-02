import ApiError from 'lib-server/error';
import prisma from 'lib-server/prisma';
import { userLoginSchema } from 'lib-server/validation';
import { User } from '@prisma/client';
import { compare } from 'bcryptjs';
import { UserLoginData } from 'types/models/User';

// for rest api? https://next-auth.js.org/getting-started/rest-api
// must return error
export const loginUser = async ({
  email,
  password,
}: UserLoginData): Promise<{
  user: User | null;
  error: ApiError | null;
}> => {
  // validation only in this service
  const result = userLoginSchema.safeParse({ email, password });

  if (!result.success) {
    return {
      user: null,
      error: ApiError.fromZodError((result as any).error),
    };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return {
      user: null,
      error: new ApiError(`User with email: ${email} does not exist.`, 404),
    };
  }

  const isValid = password && user.password && (await compare(password, user.password));

  if (!isValid) {
    return {
      user,
      error: new ApiError('Invalid password.', 401),
    };
  }

  return { user, error: null };
};
