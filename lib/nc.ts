import { NextApiRequest, NextApiResponse } from 'next';
import connect from 'next-connect';

const nc = () =>
  connect<NextApiRequest, NextApiResponse>({
    onError(error, req, res) {
      res.status(501).json({ error: `Error: ${error.message}` });
    },
    onNoMatch(req, res) {
      res.status(405).json({ error: `Method '${req.method}' not allowed` });
    },
    // attachParams: true, // req.params
  });

export default nc;
