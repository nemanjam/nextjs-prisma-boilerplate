import { Routes } from 'lib-client/constants';
import { join } from 'path';

// node process, root folder, package.json
// must be defined or entire root folder will be deleted on seed
const rootDirAbsolutePath = join(__dirname, '..');

export const avatarsFolderAbsolutePath = `${rootDirAbsolutePath}${Routes.STATIC.AVATARS}`;
export const headersFolderAbsolutePath = `${rootDirAbsolutePath}${Routes.STATIC.HEADERS}`;

export const mommentFormats = {
  dateTimeForFiles: 'MMM-YYYY-DD__HH-mm-ss', // Dec-2021-22__17-14-41
  dateForUsersAndPosts: 'MMMM D, YYYY', // December 22, 2021
} as const;
