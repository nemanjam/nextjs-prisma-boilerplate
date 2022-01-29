import { useQuery } from 'react-query';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { ClientUser } from 'types';
import { Routes } from 'lib-client/constants';
import axiosInstance from 'lib-client/react-query/axios';
import QueryKeys from 'lib-client/react-query/queryKeys';
import { AxiosError } from 'axios';

const getUser = async (id: string) => {
  if (!id) return null;

  const { data } = await axiosInstance.get<ClientUser>(`${Routes.API.USERS}${id}`);
  return data;
};

// for logged in user only
export const useMe = () => {
  const { data: session, status } = useSession();
  const id = session?.user?.id;

  const query = useQuery<ClientUser, AxiosError>(QueryKeys.ME, () => getUser(id), {
    enabled: status !== 'loading',
    retry: 1,
    retryDelay: (attempt) => attempt * 1000,
    onError: (error) => {
      console.error('me query error: ', error.response);

      // id exists but not valid session, clear it
      if (id && error.response.status === 404) {
        signOut();
      }
    },
  });

  return { me: query.data, isLoadingMe: query.isLoading };
};
