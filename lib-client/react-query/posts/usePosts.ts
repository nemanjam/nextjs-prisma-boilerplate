import { useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { AxiosError } from 'axios';
import { PostsGetSearchQueryParams, PostWithAuthor } from 'types/models/Post';
import { PaginatedResponse } from 'types';
import { Routes } from 'lib-client/constants';
import axiosInstance from 'lib-client/react-query/axios';
import { filterEmptyKeys, QueryKeysType } from 'lib-client/react-query/queryKeys';

// usePaginatedQuery, first page hydrated method from getServerSideProps

const getPosts = async (params: PostsGetSearchQueryParams) => {
  const { data } = await axiosInstance.get<PaginatedResponse<PostWithAuthor>>(
    Routes.API.POSTS,
    { params }
  );
  return data;
};

export const usePosts = (queryKey: QueryKeysType, params: PostsGetSearchQueryParams) => {
  const queryClient = useQueryClient();
  const { page = 1, username, searchTerm } = params;

  const query = useQuery<PaginatedResponse<PostWithAuthor>, AxiosError>(
    filterEmptyKeys([queryKey, username, searchTerm, page]),
    () => getPosts(params),
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
        filterEmptyKeys([queryKey, username, searchTerm, page + 1]),
        () => getPosts({ ...params, page: page + 1 })
      );
    }
  }, [hasMore, page, queryClient]);

  return query;
};
