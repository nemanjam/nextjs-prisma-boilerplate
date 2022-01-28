import { useQuery } from 'react-query';
import { AxiosError } from 'axios';
import { ClientUser } from 'types';
import { Routes } from 'lib-client/constants';
import axiosInstance from 'lib-client/react-query/axios';
import QueryKeys from 'lib-client/react-query/queryKeys';
import { GetUserQueryParams } from 'pages/api/users/profile';
import { filterEmpty } from 'utils';

const getUser = async (params: GetUserQueryParams) => {
  const { data } = await axiosInstance.get<ClientUser>(Routes.API.PROFILE, { params });
  return data;
};

export const useUser = (params: GetUserQueryParams, enabled: boolean) => {
  const subKey = params?.username || params?.email || params?.id;

  const query = useQuery<ClientUser, AxiosError>(
    filterEmpty([QueryKeys.USER, subKey]),
    () => getUser(params),
    { enabled }
  );
  return query;
};
