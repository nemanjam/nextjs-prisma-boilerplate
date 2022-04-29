import { NextApiRequest, NextApiResponse } from 'next';
import { withValidation } from 'next-validations';
import { apiHandler } from 'lib-server/nc';
import { userGetSchema, validateUserSearchQueryParams } from 'lib-server/validation';
import { ClientUser } from 'types/models/User';
import { getUserByIdOrUsernameOrEmail } from 'lib-server/services/users';

const handler = apiHandler();

const validateUserGet = withValidation({
  schema: userGetSchema,
  type: 'Zod',
  mode: 'query',
});

/**
 * GET /api/users/profile?id=abc&username=john&email=email@email.com
 * single user by username or email
 * so /api/users can return users array
 */
handler.get(
  validateUserGet(),
  async (req: NextApiRequest, res: NextApiResponse<ClientUser>) => {
    // just to convert types
    const parsedData = validateUserSearchQueryParams(req.query);
    const user = await getUserByIdOrUsernameOrEmail(parsedData);
    res.status(200).json(user);
  }
);

export default handler;
