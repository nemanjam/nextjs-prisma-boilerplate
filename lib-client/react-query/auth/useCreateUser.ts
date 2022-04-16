import { useMutation } from 'react-query';
import { useRouter } from 'next/router';
import { ClientUser } from 'types/models/response';
import { Routes } from 'lib-client/constants';
import { AxiosError } from 'axios';
import axiosInstance from 'lib-client/react-query/axios';
import { User } from '@prisma/client';

export type UserCreateType = Pick<User, 'name' | 'username' | 'email' | 'password'>;

const createUser = async (user: UserCreateType) => {
  const { data } = await axiosInstance.post<ClientUser>(Routes.API.USERS, user);
  return data;
};

export const useCreateUser = () => {
  const router = useRouter();

  const mutation = useMutation<ClientUser, AxiosError, UserCreateType, unknown>(
    (data) => createUser(data),
    {
      onError: (error) => {
        console.error(error);
      },
      onSuccess: async () => {
        await router.push(Routes.SITE.LOGIN);
      },
    }
  );

  return mutation;
};
