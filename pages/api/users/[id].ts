import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { hash } from 'bcryptjs';
import prisma from 'lib/prisma';
import { avatarUpload } from 'lib/middleware/upload';
import nc, { ncOptions } from 'lib/nc';
import { requireAuth } from '@lib/middleware/auth';

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
    const { name, username, password, user } = body; // email reconfirm..., types

    const session = await getSession({ req });

    if (user.id !== id && session.user.role !== 'admin') {
      // throw not authorized
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
