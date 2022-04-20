import { useMutation, useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';
import axiosInstance from 'lib-client/react-query/axios';
import { Routes } from 'lib-client/constants';
import { PostWithAuthor, PostCreateData } from 'types/models/Post';
import QueryKeys from 'lib-client/react-query/queryKeys';

const createPost = async (post: PostCreateData) => {
  const { data } = await axiosInstance.post<PostWithAuthor>(Routes.API.POSTS, post);
  return data;
};

export const useCreatePost = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<PostWithAuthor, AxiosError, PostCreateData, unknown>(
    (post) => createPost(post),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([QueryKeys.POSTS_DRAFTS]);
        await router.push(Routes.SITE.DRAFTS);
      },
    }
  );

  return mutation;
};
