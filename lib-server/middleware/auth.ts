import { getMe } from 'lib-server/services/users';
import ApiError from 'lib-server/error';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

type NextHandler = (err?: any) => void;

export const requireAuth = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  const me = await getMe({ req });

  // dont attach req.user because it complicates types
  const error = me?.id ? undefined : new ApiError('You are not logged in.', 401);
  next(error);
};

export const requireAdmin = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  const me = await getMe({ req });
  const error =
    me?.role === 'admin' ? undefined : new ApiError('You are not an admin.', 401);
  next(error);
};
