import { useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { AxiosError } from 'axios';
import { ClientUser, PaginatedResponse } from 'types/models/response';
import { Routes } from 'lib-client/constants';
import axiosInstance from 'lib-client/react-query/axios';
import { GetUsersQueryParams } from 'pages/api/users';
import QueryKeys, { filterEmptyKeys } from 'lib-client/react-query/queryKeys';

// usePaginatedQuery, first page hydrated method from getServerSideProps

const getUsers = async (params: GetUsersQueryParams) => {
  const { data } = await axiosInstance.get<PaginatedResponse<ClientUser>>(
    Routes.API.USERS,
    { params }
  );
  return data;
};

export const useUsers = (params: GetUsersQueryParams) => {
  const queryClient = useQueryClient();
  const { page, searchTerm } = params;

  const query = useQuery<PaginatedResponse<ClientUser>, AxiosError>(
    filterEmptyKeys([QueryKeys.USERS, searchTerm, page]),
    () => getUsers(params),
    {
      keepPreviousData: true,
      staleTime: 5000,
    }
  );

  const hasMore = query.data?.pagination.hasMore;

  // prefetch next page
  useEffect(() => {
    if (hasMore) {
      queryClient.prefetchQuery(
        filterEmptyKeys([QueryKeys.USERS, searchTerm, page + 1]),
        () => getUsers({ ...params, page: page + 1 })
      );
    }
  }, [hasMore, page, queryClient]);

  return query;
};
