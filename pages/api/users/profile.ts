import { NextApiRequest, NextApiResponse } from 'next';
import { withValidation } from 'next-validations';
import prisma from 'lib-server/prisma';
import nc, { ncOptions } from 'lib-server/nc';
import ApiError from 'lib-server/error';
import { userGetSchema } from 'lib-server/validation';
import { QueryParamsType } from 'types';
import { User } from '@prisma/client';

const handler = nc(ncOptions);

const validateUserGet = withValidation({
  schema: userGetSchema,
  type: 'Zod',
  mode: 'query',
});

// unused
export type GetUserQueryParams = {
  id?: string;
  username?: string;
  email?: string;
};

// query so it can be validated with schema
export const getUserByIdOrUsernameOrEmail = async (
  query: QueryParamsType
): Promise<User> => {
  const validationResult = userGetSchema.safeParse(query);
  if (!validationResult.success) return; // throw 404 in getServerSideProps

  const { id, username, email } = validationResult.data;

  const user = await prisma.user.findFirst({
    where: { OR: [{ id }, { username }, { email }] },
  });
  return user;
};

/**
 * GET /api/users/profile?id=abc&username=john&email=email@email.com
 * single user by username or email
 * so /api/users can return users array
 */
handler.get(validateUserGet(), async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await getUserByIdOrUsernameOrEmail(req.query);

  if (!user) {
    throw new ApiError(`User not found.`, 404);
  }

  res.status(200).json(user);
});

export default handler;
