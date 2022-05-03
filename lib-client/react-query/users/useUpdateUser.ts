import { useMutation } from 'react-query';
import axiosInstance from 'lib-client/react-query/axios';
import { Routes } from 'lib-client/constants';
import {
  ClientUser,
  UserUpdateDataKeys,
  UserUpdateMutationData,
} from 'types/models/User';

const updateUser = async ({ id, user, setProgress }: UserUpdateMutationData) => {
  const formData = new FormData();
  Object.keys(user).forEach((key) => {
    formData.append(key, user[key as UserUpdateDataKeys] as string | File);
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
  const mutation = useMutation<ClientUser, Error, UserUpdateMutationData, unknown>(
    (data) => updateUser(data)
  );

  return mutation;
};

export const getImage = async (url: string): Promise<File> => {
  const response = await axiosInstance.get(url, { responseType: 'blob' });
  // const file = new File([response.data], 'default-image');

  // use Blob instead of File for jsdom polyfill
  const file = new Blob([response.data], {
    type: response.headers['content-type'],
  }) as any;
  file['lastModifiedDate'] = new Date();
  file['name'] = 'default-image';

  return file as File;
};
