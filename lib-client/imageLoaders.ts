import { ImageLoaderProps } from 'next/image';
import { ClientUser } from 'types/models/User';
import { isUrl } from 'utils';
import { Routes } from 'lib-client/constants';

export const getAvatarPath = (user: ClientUser): string => {
  return user.image && isUrl(user.image)
    ? user.image
    : `${Routes.STATIC.AVATARS}${user.image || 'placeholder-avatar.jpg'}`;
};

// in Head only
export const getAvatarPathAbsolute = (user: ClientUser): string => {
  return user.image && isUrl(user.image)
    ? user.image
    : `${process.env.NEXT_PUBLIC_BASE_URL}${getAvatarPath(user).replace(/^\//, '')}`;
};

export const getHeaderImagePath = (user: ClientUser) => {
  return `${Routes.STATIC.HEADERS}${user.headerImage || 'placeholder-header.jpg'}`;
};

// src isUrl...?
export const uploadsImageLoader = ({ src, width, quality }: ImageLoaderProps) => {
  const _src = src.replace(/^\//, '');
  return `${process.env.NEXT_PUBLIC_BASE_URL}${_src}?w=${width}&q=${quality || 75}`;
};
