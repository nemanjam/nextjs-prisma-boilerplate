import { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcryptjs';
import { User } from '@prisma/client';
import { withValidation } from 'next-validations';
import prisma from 'lib-server/prisma';
import nc, { ncOptions } from 'lib-server/nc';
import ApiError from 'lib-server/error';
import { userGetSchema, userRegisterSchema } from 'lib-server/validation';
import { QueryParamsType } from 'types';

const handler = nc(ncOptions);

const validateUserRegister = withValidation({
  schema: userRegisterSchema,
  type: 'Zod',
  mode: 'body',
});

const validateUserGet = withValidation({
  schema: userGetSchema,
  type: 'Zod',
  mode: 'query',
});

// unused
export type GetUserQueryParams = {
  username?: string;
  email?: string;
};

// query so it can be validated with schema
export const getUserByUsernameOrEmail = async (query: QueryParamsType): Promise<User> => {
  const validationResult = userGetSchema.safeParse(query);
  if (!validationResult.success) return; // throw 404 in getServerSideProps

  const { username, email } = validationResult.data;

  const user = await prisma.user.findFirst({ where: { OR: [{ username }, { email }] } });
  delete user.password;
  return user;
};

/**
 * GET /api/users?username=john&email=email@email.com
 */
handler.get(validateUserGet(), async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await getUserByUsernameOrEmail(req.query);

  if (!user) {
    throw new ApiError(`User not found.`, 404);
  }

  res.status(200).json(user);
});

/**
 * POST /api/users - register
 * Required fields in body: name, username, email, password
 */
handler.post(
  validateUserRegister(),
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { name, username, email, password: _password } = req.body;

    const _user = await prisma.user.findFirst({
      where: { email },
    });

    if (_user) throw new ApiError(`Email: ${email} already exists.`, 403);

    const password = await hash(_password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password,
        // role: 'user' // default
      },
    });

    delete user.password;
    res.status(201).json(user);
  }
);

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const users = await prisma.user.findMany();
  res.status(200).json(users);
});

export default handler;
