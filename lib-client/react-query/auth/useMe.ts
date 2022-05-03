import { useQuery } from 'react-query';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { ClientUser } from 'types/models/User';
import { Routes } from 'lib-client/constants';
import axiosInstance from 'lib-client/react-query/axios';
import QueryKeys, { filterEmptyKeys } from 'lib-client/react-query/queryKeys';
import { AxiosError } from 'axios';
import { useIsMounted } from 'components/hooks';

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
  const isMounted = useIsMounted();

  const { data: session, status } = useSession(); // needs provider
  const id = session?.user?.id;

  const query = useQuery<ClientUser | null, AxiosError>(
    filterEmptyKeys([QueryKeys.ME, id]),
    () => getUser(id),
    {
      // disable query before mount/hydrating, attempt to fix hydration error
      enabled: isMounted && status !== 'loading',
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
