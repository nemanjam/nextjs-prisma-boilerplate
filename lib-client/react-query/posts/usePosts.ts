import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { PaginatedResponse, PostWithAuthor } from 'types';
import { Routes } from 'lib-client/constants';
import axiosInstance from 'lib-client/react-query/axios';
import QueryKeys from 'lib-client/react-query/queryKeys';

// usePaginatedQuery, first page hydrated method from getServerSideProps

const getPosts = async (page: number) => {
  const { data } = await axiosInstance.get<PaginatedResponse<PostWithAuthor>>(
    Routes.API.POSTS,
    {
      params: {
        page,
        limit: 10,
      },
    }
  );
  return data;
};

const usePosts = (page: number) => {
  const queryClient = useQueryClient();

  const query = useQuery([QueryKeys.POSTS, page], () => getPosts(page), {
    keepPreviousData: true,
  });

  const hasMore = query.data?.pagination.hasMore;

  // prefetch next page
  useEffect(() => {
    if (hasMore) {
      queryClient.prefetchQuery(['projects', page + 1], () => getPosts(page + 1));
    }
  }, [hasMore, page, queryClient]);

  return query;
};

export { usePosts };
