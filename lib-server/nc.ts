export { default } from 'next-connect';
import ApiError, { handleError } from 'lib-server/error';

export const ncOptions = {
  onError(error, req, res) {
    handleError(error, req, res);
  },
  onNoMatch(req, res) {
    throw new ApiError(`Method '${req.method}' not allowed`, 405);
  },
};

// attachParams: true, // req.params
// res.status(501).json({ error: `Error: ${error.message}` });
// res.status(405).json({ error: `Method '${req.method}' not allowed` });
