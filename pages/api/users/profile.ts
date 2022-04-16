import { NextApiRequest, NextApiResponse } from 'next';
import { withValidation } from 'next-validations';
import prisma, { excludeFromUser } from 'lib-server/prisma';
import { apiHandler } from 'lib-server/nc';
import ApiError from 'lib-server/error';
import { userGetSchema } from 'lib-server/validation';
import { QueryParamsType } from 'types';
import { ClientUser } from 'types/models/User';

const handler = apiHandler();

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
): Promise<ClientUser> => {
  const validationResult = userGetSchema.safeParse(query);
  if (!validationResult.success)
    throw ApiError.fromZodError((validationResult as any).error);

  const { id, username, email } = validationResult.data;

  const user = await prisma.user.findFirst({
    where: { OR: [{ id }, { username }, { email }] },
  });

  if (!user) {
    throw new ApiError(`User not found.`, 404);
  }

  return excludeFromUser(user);
};

/**
 * GET /api/users/profile?id=abc&username=john&email=email@email.com
 * single user by username or email
 * so /api/users can return users array
 */
handler.get(
  validateUserGet(),
  async (req: NextApiRequest, res: NextApiResponse<ClientUser>) => {
    const user = await getUserByIdOrUsernameOrEmail(req.query);
    res.status(200).json(user);
  }
);

export default handler;
