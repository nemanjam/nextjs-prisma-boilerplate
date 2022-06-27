import { ImageLoaderProps } from 'next/image';
import { ClientUser } from 'types/models/User';
import { isUrl } from 'utils';
import { Routes } from 'lib-client/constants';

export const getAvatarPath = (user: ClientUser): string => {
  return user.image && isUrl(user.image)
    ? user.image
    : `${Routes.STATIC.AVATARS}${user.image || 'placeholder-avatar.jpg'}`;
};

export const getHeaderImagePath = (user: ClientUser) => {
  return `${Routes.STATIC.HEADERS}${user.headerImage || 'placeholder-header.jpg'}`;
};

export const uploadsImageLoader = ({ src, width, quality }: ImageLoaderProps) => {
  // src starts with '/'
  // use relative path for same domain
  // if its full url https://... just forward it
  return !isUrl(src) ? `${src}?w=${width}&q=${quality || 75}` : src;
};

// not used anywhere, before in CustomHead
export const getAvatarPathAbsolute = (user: ClientUser): string => {
  return user.image && isUrl(user.image)
    ? user.image
    : `${process.env.NEXT_PUBLIC_BASE_URL}${getAvatarPath(user).replace(/^\//, '')}`;
};
