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
/**
 * gets entire user object based on user.id in session
 */
export const useMe = () => {
  const { data: session, status } = useSession(); // needs provider
  const id = session?.user?.id;

  const query = useQuery<ClientUser, AxiosError>(QueryKeys.ME, () => getUser(id), {
    enabled: status !== 'loading',
    onError: (error) => {
      console.error('me query error: ', error.response);

      // id exists but not valid session, clear it
      if (id && error.response.status === 404) {
        signOut();
      }
    },
  });

  const { data, isLoading, ...rest } = query;
  return { me: data, isLoadingMe: isLoading, ...rest };
};
