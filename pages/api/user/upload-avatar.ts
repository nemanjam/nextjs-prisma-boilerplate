import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import nextConnect from 'next-connect';
import multer from 'multer';
import prisma from 'lib/prisma';
import { formatDate } from 'utils';

const upload = multer({
  storage: multer.diskStorage({
    destination: `${process.cwd()}/uploads/avatars`,
    filename: async (req, file, cb) => {
      const session = await getSession({ req });

      if (!session) {
        cb(new Error('Unauthenticated user'), null);
      }

      const fileName = `${formatDate()}_${file.originalname}`;

      // save name to db
      await prisma.user.update({
        where: { email: session.user.email },
        data: {
          image: fileName,
        },
      });

      cb(null, fileName);
    },
  }),
});

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
  onError(error, req, res) {
    res.status(501).json({ error: `Error: ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' not allowed` });
  },
});

apiRoute.use(upload.array('avatar'));

apiRoute.post(async (req, res) => {
  res.status(200).json({ data: 'success' });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};
