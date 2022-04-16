import { useQuery } from 'react-query';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { ClientUser } from 'types/models/response';
import { Routes } from 'lib-client/constants';
import axiosInstance from 'lib-client/react-query/axios';
import QueryKeys, { filterEmptyKeys } from 'lib-client/react-query/queryKeys';
import { AxiosError } from 'axios';

const getUser = async (id: string) => {
  if (!id) return null;

  const { data } = await axiosInstance.get<ClientUser>(`${Routes.API.USERS}${id}`);
  return data;
};

/**
 * gets entire user object based on user.id in session,
 * used only in MeProvider and accessed via context
 */
export const useMe = () => {
  const { data: session, status } = useSession(); // needs provider
  const id = session?.user?.id;

  const query = useQuery<ClientUser, AxiosError>(
    filterEmptyKeys([QueryKeys.ME, id]),
    () => getUser(id),
    {
      enabled: status !== 'loading',
      onError: (error) => {
        console.error('me query error: ', error.response);

        // id exists but not valid session, clear it
        if (id && error.response.status === 404) {
          signOut();
        }
      },
    }
  );

  // no need to prefetch because every page is under MeProvider

  return query;
};
