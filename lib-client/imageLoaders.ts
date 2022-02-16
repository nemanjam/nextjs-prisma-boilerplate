import { ClientUser } from 'types';

export const getAvatarPath = (user: ClientUser) => {
  return user.provider === 'credentials'
    ? `${process.env.NEXT_PUBLIC_AVATARS_PATH}${user.image || 'placeholder-avatar.jpg'}`
    : user.image;
  // can edit avatar, startsWith('https://')
};

export const getAvatarPathAbsolute = (user: ClientUser) => {
  return user.image.startsWith('https://')
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
