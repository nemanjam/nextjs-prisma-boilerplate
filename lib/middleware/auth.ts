import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

type NextHandler = (err?: any) => void;

export const requireAuth = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  const session = await getSession({ req });
  const error = session?.user
    ? undefined
    : Object.assign(new Error('You are not logged in.'), { statusCode: 401 });
  next(error);
};

export const requireAdmin = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  const session = await getSession({ req });
  const error =
    session?.user?.role === 'admin'
      ? undefined
      : Object.assign(new Error('You are not an admin'), { statusCode: 401 });
  next(error);
};
