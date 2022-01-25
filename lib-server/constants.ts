// node process, root folder, package.json
// must be defined or entire root folder will be deleted on seed
// if env vars aren't defined
export const avatarsFolderAbsolutePath = `${process.cwd()}${
  process.env.NEXT_PUBLIC_AVATARS_PATH || '/uploads/avatars/'
}`;
export const headersFolderAbsolutePath = `${process.cwd()}${
  process.env.NEXT_PUBLIC_HEADERS_PATH || '/uploads/headers/'
}`;

export const mommentFormats = {
  dateTimeForFiles: 'MMM-YYYY-DD__HH-mm-ss', // Dec-2021-22__17-14-41
  dateForUsersAndPosts: 'MMMM D, YYYY', // December 22, 2021
} as const;
