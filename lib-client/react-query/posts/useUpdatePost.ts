import { useMutation, useQueryClient } from 'react-query';
import { Post } from '@prisma/client';
import axiosInstance from 'lib-client/react-query/axios';
import { Routes } from 'lib-client/constants';
import { PostWithAuthor } from 'types';
import QueryKeys from 'lib-client/react-query/queryKeys';

export type PostUpdateType = Partial<Pick<Post, 'title' | 'content' | 'published'>>;

export type PostUpdateFormType = {
  post: PostUpdateType;
  id: number;
};

const updatePost = async ({ id, post }) => {
  const { data } = await axiosInstance.patch<PostWithAuthor>(
    `${Routes.API.POSTS}${id}`,
    post
  );
  return data;
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<PostWithAuthor, Error, PostUpdateFormType, unknown>(
    (data) => updatePost(data),
    {
      onError: (error) => {
        console.error(error);
      },
      onSuccess: async (data) => {
        await Promise.all([
          queryClient.invalidateQueries(QueryKeys.POSTS_DRAFTS),
          queryClient.invalidateQueries(QueryKeys.POSTS_HOME),
          queryClient.invalidateQueries(QueryKeys.POSTS_PROFILE),
          queryClient.invalidateQueries([QueryKeys.POST, data.id]),
        ]);
      },
    }
  );

  return mutation;
};
