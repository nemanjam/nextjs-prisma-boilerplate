import { useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { PaginatedResponse, PostWithAuthor } from 'types';
import { Routes } from 'lib-client/constants';
import axiosInstance from 'lib-client/react-query/axios';
import QueryKeys from 'lib-client/react-query/queryKeys';
import { GetPostsQueryParams } from 'pages/api/posts';

// usePaginatedQuery, first page hydrated method from getServerSideProps

const getPosts = async (params: GetPostsQueryParams) => {
  const { data } = await axiosInstance.get<PaginatedResponse<PostWithAuthor>>(
    Routes.API.POSTS,
    { params }
  );
  return data;
};

const usePosts = (params: GetPostsQueryParams) => {
  const queryClient = useQueryClient();
  const { page, username } = params;

  const queryKey = [QueryKeys.POSTS, username, page].filter((item) => item || item === 0);

  const query = useQuery(queryKey, () => getPosts(params), {
    keepPreviousData: true,
    staleTime: 5000,
  });

  const hasMore = query.data?.pagination.hasMore;

  // prefetch next page
  useEffect(() => {
    if (hasMore) {
      queryClient.prefetchQuery(['projects', page + 1], () =>
        getPosts({ ...params, page: page + 1 })
      );
    }
  }, [hasMore, page, queryClient]);

  return query;
};

export { usePosts };
