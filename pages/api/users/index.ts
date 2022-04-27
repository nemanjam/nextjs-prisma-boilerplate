import { NextApiRequest, NextApiResponse } from 'next';
import { withValidation } from 'next-validations';
import { apiHandler } from 'lib-server/nc';
import { usersGetSchema, userRegisterSchema } from 'lib-server/validation';
import { PaginatedResponse } from 'types';
import { ClientUser } from 'types/models/User';
import { createUser, getUsers } from '@lib-server/services/users';

const handler = apiHandler();

const validateUserRegister = withValidation({
  schema: userRegisterSchema.innerType().omit({
    confirmPassword: true,
  }),
  type: 'Zod',
  mode: 'body',
});

const validateUsersGet = withValidation({
  schema: usersGetSchema,
  type: 'Zod',
  mode: 'query',
});

/**
 * POST /api/users - register
 * Required fields in body: name, username, email, password
 */
handler.post(
  validateUserRegister(),
  async (req: NextApiRequest, res: NextApiResponse<ClientUser>) => {
    const user = await createUser(req.body);
    res.status(201).json(user);
  }
);

handler.get(
  validateUsersGet(),
  async (req: NextApiRequest, res: NextApiResponse<PaginatedResponse<ClientUser>>) => {
    const users = await getUsers(req.query);
    res.status(200).json(users);
  }
);

export default handler;
