import { useQuery } from 'react-query';
import { AxiosError } from 'axios';
import { ClientUser, UserGetQueryParams } from 'types/models/User';
import { Routes } from 'lib-client/constants';
import axiosInstance from 'lib-client/react-query/axios';
import QueryKeys, { filterEmptyKeys } from 'lib-client/react-query/queryKeys';

const getUser = async (params: UserGetQueryParams) => {
  const { data } = await axiosInstance.get<ClientUser>(Routes.API.PROFILE, { params });
  return data;
};

export const useUser = (params: UserGetQueryParams) => {
  const subKey = params?.username || params?.email || params?.id;

  const query = useQuery<ClientUser, AxiosError>(
    filterEmptyKeys([QueryKeys.USER, subKey]),
    () => getUser(params),
    { enabled: !!subKey }
  );
  return query;
};
