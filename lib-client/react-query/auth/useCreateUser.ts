import { useMutation } from 'react-query';
import { useRouter } from 'next/router';
import { Routes } from 'lib-client/constants';
import { AxiosError } from 'axios';
import axiosInstance from 'lib-client/react-query/axios';
import { ClientUser } from 'types/models/User';
import { UserCreateData } from 'types/models/User';

const createUser = async (user: UserCreateData) => {
  const { data } = await axiosInstance.post<ClientUser>(Routes.API.USERS, user);
  return data;
};

export const useCreateUser = () => {
  const router = useRouter();

  const mutation = useMutation<ClientUser, AxiosError, UserCreateData, unknown>(
    (data) => createUser(data),
    {
      onSuccess: async () => {
        await router.push(Routes.SITE.LOGIN);
      },
    }
  );

  return mutation;
};
