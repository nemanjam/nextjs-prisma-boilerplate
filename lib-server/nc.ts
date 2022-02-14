import { NextApiRequest, NextApiResponse } from 'next';
import ApiError, { handleError } from 'lib-server/error';
export { default } from 'next-connect';

export const ncOptions = {
  onError(error: Error, req: NextApiRequest, res: NextApiResponse) {
    handleError(error, req, res);
  },
  onNoMatch(req: NextApiRequest, res: NextApiResponse) {
    const error = new ApiError(`Method '${req.method}' not allowed`, 405);
    //not in api, handle it manually
    handleError(error, req, res);
  },
};

// attachParams: true, // req.params
// res.status(501).json({ error: `Error: ${error.message}` });
// res.status(405).json({ error: `Method '${req.method}' not allowed` });
