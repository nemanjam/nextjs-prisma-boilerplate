import { useQuery } from 'react-query';
import { AxiosError } from 'axios';
import axiosInstance from 'lib-client/react-query/axios';
import QueryKeys, { filterEmptyKeys } from 'lib-client/react-query/queryKeys';
import { ClientUser } from 'types/models/User';
import { getAvatarPath, getHeaderImagePath } from 'lib-client/imageLoaders';

export const getImage = async (imageUrl: string | undefined): Promise<File> => {
  if (!imageUrl) return Promise.reject(new Error('Invalid imageUrl.'));

  const response = await axiosInstance.get(imageUrl, { responseType: 'blob' });
  // const file = new File([response.data], 'default-image');

  // use Blob instead of File for jsdom polyfill
  const file = new Blob([response.data], {
    type: response.headers['content-type'],
  }) as any;
  file['lastModifiedDate'] = new Date();
  file['name'] = 'default-image';

  return file as File;
};

export const useImage = (
  user: ClientUser | undefined,
  imageType: 'avatar' | 'header'
) => {
  const userId = user?.id;

  const imageUrl =
    imageType === 'avatar'
      ? user && getAvatarPath(user)
      : user && getHeaderImagePath(user);

  const query = useQuery<File | null, AxiosError>(
    filterEmptyKeys([QueryKeys.IMAGE, userId, imageType]),
    () => getImage(imageUrl),
    {
      enabled: !!userId && !!imageUrl,
      suspense: false,
    }
  );

  return query;
};
