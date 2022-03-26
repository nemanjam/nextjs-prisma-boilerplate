import { ImageLoaderProps } from 'next/image';
import { ClientUser } from 'types';
import { isUrl } from 'utils';
import { Routes } from 'lib-client/constants';

export const getAvatarPath = (user: ClientUser) => {
  return isUrl(user.image)
    ? user.image
    : `${Routes.STATIC.AVATARS}${user.image || 'placeholder-avatar.jpg'}`;
};

export const getAvatarPathAbsolute = (user: ClientUser) => {
  return isUrl(user.image)
    ? user.image
    : `${process.env.NEXT_PUBLIC_BASE_URL}${getAvatarPath(user).replace(/^\//, '')}`;
};

export const getHeaderImagePath = (user: ClientUser) => {
  return `${Routes.STATIC.HEADERS}${user.headerImage || 'placeholder-header.jpg'}`;
};

export const uploadsImageLoader = ({ src, width, quality }: ImageLoaderProps) => {
  return `${process.env.NEXT_PUBLIC_BASE_URL}${src}?w=${width}&q=${quality || 75}`;
};
