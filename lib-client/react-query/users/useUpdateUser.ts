import { Dispatch, SetStateAction } from 'react';
import { useMutation } from 'react-query';
import { User } from '@prisma/client';
import axiosInstance from 'lib-client/react-query/axios';
import { Routes } from 'lib-client/constants';
import { ClientUser } from 'types/models/response';

export type UserUpdateType = Partial<
  Pick<User, 'username' | 'name' | 'bio' | 'image' | 'headerImage' | 'password'>
>;

export type UserUpdateFormType = {
  id: string;
  user: UserUpdateType;
  setProgress: Dispatch<SetStateAction<number>>;
};

const updateUser = async ({ id, user, setProgress }: UserUpdateFormType) => {
  const formData = new FormData();
  Object.keys(user).forEach((key) => {
    formData.append(key, user[key]);
  });

  const config = {
    headers: { 'content-type': 'multipart/form-data' },
    // fix for onUploadProgress not supported in msw
    ...(process.env.NODE_ENV !== 'test' && {
      onUploadProgress: (event: ProgressEvent) => {
        const _progress = Math.round((event.loaded * 100) / event.total);
        setProgress(_progress);
      },
    }),
  };

  const { data } = await axiosInstance.patch<ClientUser>(
    `${Routes.API.USERS}${id}`,
    formData,
    config
  );
  return data;
};

export const useUpdateUser = () => {
  const mutation = useMutation<ClientUser, Error, UserUpdateFormType, unknown>(
    (data) => updateUser(data),
    {
      onError: (error) => {
        console.error(error);
      },
      // implemented in Settings component
      // onSuccess: async (data) => {},
    }
  );

  return mutation;
};

export const getImage = async (url: string): Promise<File> => {
  const response = await axiosInstance.get(url, { responseType: 'blob' });
  // const file = new File([response.data], 'default-image');

  // use Blob instead of File for jsdom polyfill
  const file = new Blob([response.data], { type: response.headers['content-type'] });
  file['lastModifiedDate'] = new Date();
  file['name'] = 'default-image';

  return file as File;
};
