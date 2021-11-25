import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { hash } from 'bcryptjs';
import prisma from 'lib-server/prisma';
import { avatarUpload } from 'lib-server/middleware/upload';
import nc, { ncOptions } from 'lib-server/nc';
import { requireAuth } from 'lib-server/middleware/auth';
import ApiError from 'lib-server/error';

interface MulterRequest extends NextApiRequest {
  file: any;
}

const handler = nc(ncOptions);

// joi validate middleware

handler.patch(
  requireAuth,
  avatarUpload,
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { query, body, file } = req as MulterRequest;
    const id = query.id as string; // so admin can change him too
    const { name, username, password } = body; // email reconfirm..., types

    const session = await getSession({ req });

    if (session.user.id !== id && session.user.role !== 'admin') {
      throw new ApiError('Not authorized.', 401);
    }

    const data = {
      ...(name && { name }),
      ...(username && { username }),
      ...(file?.filename && { image: file.filename }),
      ...(password && { password: await hash(password, 10) }),
    };

    const _user = await prisma.user.update({
      where: { id },
      data,
    });

    res.status(200).json({ user: _user });
  }
);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
