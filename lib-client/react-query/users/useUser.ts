import { useQuery } from 'react-query';
import { AxiosError } from 'axios';
import { ClientUser } from 'types';
import { Routes } from 'lib-client/constants';
import axiosInstance from 'lib-client/react-query/axios';
import QueryKeys from 'lib-client/react-query/queryKeys';

const getUser = async (id: string) => {
  const { data } = await axiosInstance.get<ClientUser>(`${Routes.API.USERS}${id}`);
  return data;
};

export const useUser = (id: string) => {
  const query = useQuery<ClientUser, AxiosError>([QueryKeys.USER, id], () => getUser(id));
  return query;
};
