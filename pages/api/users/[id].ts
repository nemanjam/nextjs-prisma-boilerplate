import { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcryptjs';
import { withValidation } from 'next-validations';
import prisma, { excludeFromUser, getMe } from 'lib-server/prisma';
import { profileImagesUpload } from 'lib-server/middleware/upload';
import { apiHandler } from 'lib-server/nc';
import { requireAuth } from 'lib-server/middleware/auth';
import ApiError from 'lib-server/error';
import { userIdCuidSchema, userUpdateSchema } from 'lib-server/validation';
import { ClientUser } from 'types/models/User';

type MulterRequest = NextApiRequest & { files: any };

const handler = apiHandler();
const getId = (req: NextApiRequest) => req.query.id as string;

const validateUserIdCuid = (id: string) => {
  const result = userIdCuidSchema.safeParse({ id });
  if (!result.success) throw ApiError.fromZodError((result as any).error);
};

const validateUserUpdate = withValidation({
  schema: userUpdateSchema,
  type: 'Zod',
  mode: 'body',
});

export const getUserById = async (id: string) => {
  validateUserIdCuid(id);
  const user = await prisma.user.findUnique({ where: { id } });
  return user;
};

// GET /api/users/:id
// only for me query
handler.get(async (req: NextApiRequest, res: NextApiResponse<ClientUser>) => {
  const user = await getUserById(getId(req));

  if (!user) throw new ApiError('User not found.', 404);

  res.status(200).json(excludeFromUser(user));
});

handler.patch(
  requireAuth,
  profileImagesUpload,
  validateUserUpdate(),
  async (req: NextApiRequest, res: NextApiResponse<ClientUser>) => {
    const { body, files } = req as MulterRequest;
    const id = getId(req);
    validateUserIdCuid(id);

    const { name, username, password } = body; // email reconfirm...

    const me = await getMe({ req });
    // if session.user.id === id force recreate session

    if (!(me && (me.id === id || me.role === 'admin'))) {
      throw new ApiError('Not authorized.', 401);
    }

    const data = {
      ...(name && { name }),
      ...(username && { username }),
      ...(files?.avatar?.length > 0 && { image: files.avatar[0].filename }),
      ...(files?.header?.length > 0 && { headerImage: files.header[0].filename }),
      ...(password && { password: await hash(password, 10) }),
    };

    const user = await prisma.user.update({
      where: { id },
      data,
    });

    res.status(200).json(excludeFromUser(user));
  }
);

export const config = {
  api: {
    bodyParser: false,
  },
};

handler.delete(async (req: NextApiRequest, res: NextApiResponse<ClientUser>) => {
  const id = getId(req);
  validateUserIdCuid(id);

  // delete posts too, cascade defined in schema
  const user = await prisma.user.delete({ where: { id } });

  if (!user) throw new ApiError('User not found.', 404);

  res.status(204).json(excludeFromUser(user));
});

export default handler;
