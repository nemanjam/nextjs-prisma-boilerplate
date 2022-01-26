import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { hash } from 'bcryptjs';
import { withValidation } from 'next-validations';
import prisma from 'lib-server/prisma';
import { profileImagesUpload } from 'lib-server/middleware/upload';
import nc, { ncOptions } from 'lib-server/nc';
import { requireAuth } from 'lib-server/middleware/auth';
import ApiError from 'lib-server/error';
import { userUpdateSchema } from 'lib-server/validation';

type MulterRequest = NextApiRequest & { files: any };

const handler = nc(ncOptions);
const getId = (req: NextApiRequest) => req.query.id as string;

const validateUserUpdate = withValidation({
  schema: userUpdateSchema,
  type: 'Zod',
  mode: 'body',
});

// GET /api/users/:id
// for me query
handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await prisma.user.findUnique({ where: { id: getId(req) } });
  res.status(200).json({ user });
});

handler.patch(
  requireAuth,
  profileImagesUpload,
  validateUserUpdate(),
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { body, files } = req as MulterRequest;
    const id = getId(req);
    const { name, username, password } = body; // email reconfirm...

    const session = await getSession({ req });
    // if session.user.id === id force recreate session

    if (!(session?.user && (session.user.id === id || session.user.role === 'admin'))) {
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

    delete user.password;

    res.status(200).json(user);
  }
);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
