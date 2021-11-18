import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import multer from 'multer';
import prisma from 'lib/prisma';

const formatDate = (date = Date.now()) => {
  let d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [month, day, year].join('-');
};

const upload = multer({
  storage: multer.diskStorage({
    destination: process.env.UPLOADS_PATH,
    filename: async (req, file, cb) => {
      const fileName = `${formatDate()}_${file.originalname}`;

      // save name to db
      const _user = await prisma.user.update({
        where: { email: '' }, // pass id
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

apiRoute.post((req, res) => {
  res.status(200).json({ data: 'success' });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};
