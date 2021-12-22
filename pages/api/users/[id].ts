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

const validateUserUpdate = withValidation({
  schema: userUpdateSchema,
  type: 'Zod',
  mode: 'body',
});

handler.patch(
  requireAuth,
  profileImagesUpload,
  validateUserUpdate(),
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { query, body, files } = req as MulterRequest;
    const id = query.id as string;
    const { name, username, password } = body; // email reconfirm...

    const session = await getSession({ req });
    // if session.user.id === id force recreate session

    if (!(session?.user && (session.user.id === id || session.user.role === 'admin'))) {
      throw new ApiError('Not authorized.', 401);
    }

    const data = {
      ...(name && { name }),
      ...(username && { username }),
      ...(files?.avatar[0]?.path && { image: files.avatar[0].path }),
      ...(files?.header[0]?.path && { headerImage: files.header[0].path }),
      ...(password && { password: await hash(password, 10) }),
    };

    const user = await prisma.user.update({
      where: { id },
      data,
    });

    res.status(200).json({ user });
  }
);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
