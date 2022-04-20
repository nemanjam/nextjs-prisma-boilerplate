import { useMutation, useQueryClient } from 'react-query';
import { Routes } from 'lib-client/constants';
import axiosInstance from 'lib-client/react-query/axios';
import { AxiosError } from 'axios';
import { signOut } from 'next-auth/react';

export type SeedResponseType = {
  success: boolean;
};

const createSeed = async () => {
  const { data } = await axiosInstance.post<SeedResponseType>(Routes.API.SEED);
  return data;
};

export const useCreateSeed = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<SeedResponseType, AxiosError, void, unknown>(
    () => createSeed(),
    {
      useErrorBoundary: true, // the only mutation to use ErrorBoundary
      onError: (error) => {
        console.error(error);
      },
      onSuccess: async () => {
        // clear everything
        signOut();
        queryClient.clear();
      },
    }
  );

  return mutation;
};
