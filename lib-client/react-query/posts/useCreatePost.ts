import { useMutation, useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
import { Post } from '@prisma/client';
import { AxiosError } from 'axios';
import axiosInstance from 'lib-client/react-query/axios';
import { Routes } from 'lib-client/constants';
import { PostWithAuthor } from 'types/models/response';
import QueryKeys from 'lib-client/react-query/queryKeys';

export type PostCreateType = Pick<Post, 'title' | 'content'>;

const createPost = async (post: PostCreateType) => {
  const { data } = await axiosInstance.post<PostWithAuthor>(Routes.API.POSTS, post);
  return data;
};

export const useCreatePost = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<PostWithAuthor, AxiosError, PostCreateType, unknown>(
    (post: PostCreateType) => createPost(post),
    {
      onError: (error) => {
        console.error(error);
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries([QueryKeys.POSTS_DRAFTS]);
        await router.push(Routes.SITE.DRAFTS);
      },
    }
  );

  return mutation;
};
