import ApiError from '@lib/error';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

type NextHandler = (err?: any) => void;

export const requireAuth = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  const session = await getSession({ req });
  console.log('session', session);

  const error = session?.user
    ? undefined
    : new ApiError('You are not logged in.', 401);
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
      : new ApiError('You are not an admin.', 401);
  next(error);
};
