import { useQuery } from 'react-query';
import { AxiosError } from 'axios';
import { ClientUser, UserGetData } from 'types/models/User';
import { Routes } from 'lib-client/constants';
import axiosInstance from 'lib-client/react-query/axios';
import QueryKeys, { filterEmptyKeys } from 'lib-client/react-query/queryKeys';

export const getImage = async (url: string): Promise<File> => {
  const response = await axiosInstance.get(url, { responseType: 'blob' });
  // const file = new File([response.data], 'default-image');

  // use Blob instead of File for jsdom polyfill
  const file = new Blob([response.data], {
    type: response.headers['content-type'],
  }) as any;
  file['lastModifiedDate'] = new Date();
  file['name'] = 'default-image';

  return file as File;
};

export const useUser = (params: UserGetData) => {
  const subKey = params?.username || params?.email || params?.id;

  const query = useQuery<ClientUser, AxiosError>(
    filterEmptyKeys([QueryKeys.USER, subKey]),
    () => getUser(params),
    { enabled: !!subKey }
  );
  return query;
};
