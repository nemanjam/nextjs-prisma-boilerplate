import { useMutation, useQueryClient } from 'react-query';
import { Post } from '@prisma/client';
import axiosInstance from 'lib-client/react-query/axios';
import { Routes } from 'lib-client/constants';
import { PostWithAuthor } from 'types';
import QueryKeys from 'lib-client/react-query/queryKeys';

export type PostUpdateType = Partial<Pick<Post, 'title' | 'content' | 'published'>> & {
  id: number;
};

const updatePost = async (post: PostUpdateType) => {
  const { id, ...rest } = post;
  const { data } = await axiosInstance.patch<PostWithAuthor>(
    `${Routes.API.POSTS}${id}`,
    rest
  );
  return data;
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<PostWithAuthor, Error, PostUpdateType, unknown>(
    (post: PostUpdateType) => updatePost(post),
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
