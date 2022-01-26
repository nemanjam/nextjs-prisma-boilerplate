import { useQuery } from 'react-query';
import { useSession } from 'next-auth/react';
import { ClientUser } from 'types';
import { Routes } from 'lib-client/constants';
import axiosInstance from 'lib-client/react-query/axios';
import QueryKeys from 'lib-client/react-query/queryKeys';

const getUser = async (id: string) => {
  if (!id) return null;

  const { data } = await axiosInstance.get<ClientUser>(`${Routes.API.USERS}${id}`);
  return data;
};

// for logged in user only
export const useMe = () => {
  const { data: session, status } = useSession();
  const id = session?.user?.id;

  console.log('session', session, 'status', status);

  const query = useQuery(QueryKeys.ME, () => getUser(id), {
    retry: 1,
    retryDelay: (attempt) => attempt * 1000,
  });

  return query;
};
