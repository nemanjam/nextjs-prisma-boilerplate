import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { hash } from 'bcryptjs';
import prisma from 'lib/prisma';
import avatarUpload from 'lib/middleware/avatarUpload';
import nc, { options } from 'lib/nc';

interface MulterRequest extends NextApiRequest {
  file: any;
}

const handler = nc(options);

// joi validate middleware
handler.use(avatarUpload);

const updateUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query, body, file } = req as MulterRequest;
  const id = query.id as string; // so admin can change him too
  const { name, username, password } = body; // email reconfirm..., types

  const session = await getSession({ req });

  if (session.user.id !== id && session.user.role !== 'admin') {
    // throw not authorized
  }

  const data = {
    ...(name && { name }),
    ...(username && { username }),
    ...(file?.filename && { image: file.filename }),
    ...(password && { password: await hash(password, 10) }),
  };

  const user = await prisma.user.update({
    where: { id },
    data,
  });

  res.status(200).json({ post: user });
};

handler.patch(updateUser);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
