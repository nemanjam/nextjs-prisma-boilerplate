import multer from 'multer';
import { formatDate } from 'utils';
import { extname } from 'path';
import { avatarsFolderAbsolutePath } from 'lib-server/constants';

export const avatarUpload = multer({
  storage: multer.diskStorage({
    destination: avatarsFolderAbsolutePath,
    filename: async (req, file, cb) => {
      const fileName = `${formatDate()}_${file.originalname}`;
      cb(null, fileName);
    },
  }),
  fileFilter: function (req, file, cb) {
    const { originalname, mimetype } = file;
    const fileSize = parseInt(req.headers['content-length']);
    console.log('fileSize', fileSize);

    const extension = extname(originalname);
    if (
      !['.png', '.jpg', '.jpeg'].includes(extension) ||
      !['image/png', 'image/jpg', 'image/jpeg'].includes(mimetype)
    ) {
      return cb(new Error('Only images are allowed'));
    }

    cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024, // 1MB
  },
}).single('avatar');
