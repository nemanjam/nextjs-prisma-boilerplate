import multer from 'multer';
import { formatDate } from 'utils';
import { extname } from 'path';
import {
  avatarsFolderAbsolutePath,
  headersFolderAbsolutePath,
  mommentFormats,
} from 'lib-server/constants';
import moment from 'moment';

export const profileImagesUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === 'avatar') {
        cb(null, avatarsFolderAbsolutePath);
      } else if (file.fieldname === 'header') {
        cb(null, headersFolderAbsolutePath);
      }
    },
    filename: async (req, file, cb) => {
      const fileName = `${moment().format(mommentFormats.dateTimeForFiles)}__${
        file.originalname
      }`;
      cb(null, fileName);
    },
  }),
  fileFilter: function (req, file, cb) {
    const { originalname, mimetype, fieldname, size } = file;

    const extension = extname(originalname);
    if (
      !['.png', '.jpg', '.jpeg'].includes(extension) ||
      !['image/png', 'image/jpg', 'image/jpeg'].includes(mimetype)
    ) {
      return cb(new Error('Only images are allowed'));
    }

    if (fieldname === 'avatar' && size > 1024 * 1024) {
      return cb(new Error('Avatar image size exceeds 1 MB'));
    }

    if (fieldname === 'header' && size > 1024 * 1024 * 2) {
      return cb(new Error('Header image size exceeds 2 MB'));
    }

    cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
}).fields([
  {
    name: 'avatar',
    maxCount: 1,
  },
  {
    name: 'header',
    maxCount: 1,
  },
]);
