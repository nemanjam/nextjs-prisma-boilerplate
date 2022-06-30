import { useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { AxiosError } from 'axios';
import { PostsGetData, PostWithAuthor } from 'types/models/Post';
import { PaginatedResponse } from 'types';
import { Routes } from 'lib-client/constants';
import axiosInstance from 'lib-client/react-query/axios';
import QueryKeys, {
  filterEmptyKeys,
  QueryKeysType,
} from 'lib-client/react-query/queryKeys';

const getPosts = async (params: PostsGetData) => {
  const { data } = await axiosInstance.get<PaginatedResponse<PostWithAuthor>>(
    Routes.API.POSTS,
    { params }
  );
  return data;
};

export const usePosts = (queryKey: QueryKeysType, params: PostsGetData) => {
  const queryClient = useQueryClient();
  const { page = 1, userId, searchTerm } = params;

  // drafts is dependant query on useMe
  const shouldDisableDrafts = queryKey === QueryKeys.POSTS_DRAFTS && !!userId;

  const query = useQuery<PaginatedResponse<PostWithAuthor>, AxiosError>(
    // key must match getServerSideProps or hydration error
    filterEmptyKeys([queryKey, userId, searchTerm, page]),
    () => getPosts(params),
    {
      keepPreviousData: true,
      staleTime: 5000,
      enabled: shouldDisableDrafts,
    }
  );

  const hasMore = query.data?.pagination.hasMore;

  // prefetch next page
  useEffect(() => {
    if (hasMore) {
      queryClient.prefetchQuery(
        filterEmptyKeys([queryKey, userId, searchTerm, page + 1]),
        () => getPosts({ ...params, page: page + 1 })
      );
    }
  }, [hasMore, page, queryClient]);

  return query;
};
