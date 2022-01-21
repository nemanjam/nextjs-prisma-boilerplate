import { useQuery } from 'react-query';
import { PostWithAuthor } from 'types';
import { Routes } from 'lib-client/constants';
import axiosInstance from 'lib-client/react-query/axios';
import QueryKeys from 'lib-client/react-query/queryKeys';

// usePaginatedQuery, first page hydrated method from getServerSideProps

const getPosts = async (): Promise<PostWithAuthor[]> => {
  const { data } = await axiosInstance.get<{ posts: PostWithAuthor[] }>(Routes.API.POSTS);
  return data.posts;
};

const usePosts = () => {
  return useQuery(QueryKeys.POSTS, getPosts);
};

export { usePosts };
