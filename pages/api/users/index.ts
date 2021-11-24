import { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcryptjs';
import prisma from 'lib/prisma';
import nc, { ncOptions } from 'lib/nc';
import ApiError from '@lib/error';

const handler = nc(ncOptions);

// todo: validate...

/**
 * POST /api/users
 * Required fields in body: name, username, email, password
 */

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
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

  res.status(201).json({ user });
});

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const users = await prisma.user.findMany();
  res.status(200).json({ users });
});

export default handler;
