import { User } from 'next-auth';

export const uniqueString = (length: number) => {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const formatDate = (date = Date.now()) => {
  let d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [month, day, year].join('-');
};

export const isBrowser = () => typeof window !== 'undefined';

export const getAvatarPath = (user: User) => {
  return user.provider === 'credentials'
    ? `${process.env.NEXT_PUBLIC_AVATARS_PATH}${user.image || 'placeholder-avatar.jpg'}`
    : user.image;
};
