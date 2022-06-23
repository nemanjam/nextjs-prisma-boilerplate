import { useQuery } from 'react-query';
import { getSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { ClientUser } from 'types/models/User';
import { Routes } from 'lib-client/constants';
import axiosInstance from 'lib-client/react-query/axios';
import QueryKeys, { filterEmptyKeys } from 'lib-client/react-query/queryKeys';
import { AxiosError } from 'axios';

// id - undefined
// user - null

const getUserId = async (): Promise<string | undefined> => {
  const session = await getSession();
  return session?.user?.id;
};

/**
 * used for dependant query in useMe
 */
const useMeId = () => {
  const query = useQuery<string | undefined, AxiosError>([QueryKeys.ME_ID], () =>
    getUserId()
  );
  return query;
};

const getUser = async (id: string | undefined) => {
  if (!id) return null;

  const { data } = await axiosInstance.get<ClientUser>(`${Routes.API.USERS}${id}`);
  return data;
};

/**
 * gets entire user object based on user.id in session,
 * used only in MeProvider and accessed via context
 */
export const useMe = () => {
  const { data: id, status } = useMeId();
  // const id = 'cl4709d6k00519gqo9rv6441l';

  const query = useQuery<ClientUser | null, AxiosError>(
    filterEmptyKeys([QueryKeys.ME, id]),
    () => getUser(id),
    {
      enabled: status !== 'loading',
      onError: (error) => {
        console.error('me query error: ', error.response);

        // id exists but not valid session, clear it
        if (id && error.response?.status === 404) {
          signOut();
        }
      },
    }
  );

  // no need to prefetch because every page is under MeProvider

  return query;
};


await queryClient.prefetchQuery([QueryKeys.ME_ID], async () => me?.id ?? null);
