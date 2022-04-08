import { useMutation, useQueryClient } from 'react-query';
import { AxiosError } from 'axios';
import axiosInstance from 'lib-client/react-query/axios';
import { Routes } from 'lib-client/constants';
import { ClientUser } from 'types';
import QueryKeys from 'lib-client/react-query/queryKeys';

const deleteUser = async (id: string) => {
  const { data } = await axiosInstance.delete<ClientUser>(`${Routes.API.USERS}${id}`);
  return data;
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ClientUser, AxiosError, string, unknown>(
    (id) => deleteUser(id),
    {
      onError: (error) => {
        console.error(error);
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries([QueryKeys.USERS]);
      },
    }
  );

  return mutation;
};
