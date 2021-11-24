import { NextApiRequest, NextApiResponse } from 'next';

export default class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleError = (
  error: any,
  req: NextApiRequest,
  res: NextApiResponse
) => {
  console.error('my error', error);
  res.status(error.statusCode || 500).send(error.message);
};
