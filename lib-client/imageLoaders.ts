import { ClientUser } from 'types';
import { isUrl } from 'utils';

export const getAvatarPath = (user: ClientUser) => {
  return isUrl(user.image)
    ? user.image
    : `${process.env.NEXT_PUBLIC_AVATARS_PATH}${user.image || 'placeholder-avatar.jpg'}`;
};

export const getAvatarPathAbsolute = (user: ClientUser) => {
  return isUrl(user.image)
    ? user.image
    : `${process.env.NEXT_PUBLIC_BASE_URL}${getAvatarPath(user).replace(/^\//, '')}`;
};

export const getHeaderImagePath = (user: ClientUser) => {
  return `${process.env.NEXT_PUBLIC_HEADERS_PATH}${
    user.headerImage || 'placeholder-header.jpg'
  }`;
};

export const uploadsImageLoader = ({ src, width, quality }) => {
  return `${process.env.NEXT_PUBLIC_BASE_URL}${src}?w=${width}&q=${quality || 75}`;
};
