import { useMutation, useQueryClient } from 'react-query';
import axiosInstance from 'lib-client/react-query/axios';
import { AxiosError } from 'axios';
import { Routes } from 'lib-client/constants';
import { PostWithAuthor } from 'types/models/response';
import QueryKeys from 'lib-client/react-query/queryKeys';

const deletePost = async (id: number) => {
  const { data } = await axiosInstance.delete<PostWithAuthor>(`${Routes.API.POSTS}${id}`);
  return data;
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<PostWithAuthor, AxiosError, number, unknown>(
    (id: number) => deletePost(id),
    {
      onError: (error) => {
        console.error(error);
      },
      onSuccess: async (data) => {
        await Promise.all([
          queryClient.invalidateQueries([QueryKeys.POSTS_DRAFTS]),
          queryClient.invalidateQueries([QueryKeys.POSTS_HOME]),
          queryClient.invalidateQueries([QueryKeys.POSTS_PROFILE]),
          queryClient.invalidateQueries([QueryKeys.POST, data.id]),
        ]);
      },
    }
  );

  return mutation;
};
