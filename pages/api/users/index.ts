import { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcryptjs';
import prisma from 'lib/prisma';
import nc from 'lib/nc';

const handler = nc();

// todo: validate...

/**
 * POST /api/users
 * Required fields in body: name, username, email, password
 */

const createUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, username, email, password: _password } = req.body;

  const _user = await prisma.user.findFirst({
    where: { email },
  });

  if (_user) throw new Error(`Email: ${email} already exists.`);

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
};

const getUsers = async (req: NextApiRequest, res: NextApiResponse) => {
  const users = await prisma.user.findMany();
  res.status(200).json({ users });
};

handler.post(createUser);
handler.get(getUsers);

export default handler;
