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
  let userId: string | undefined;
  let imageUrl: string | undefined;
  let imageName: string | undefined;

  if (user) {
    userId = user.id;

    if (imageType === 'avatar') {
      imageUrl = getAvatarPath(user);
      imageName = user.image ?? undefined;
    } else {
      imageUrl = getHeaderImagePath(user);
      imageName = user.headerImage ?? undefined;
    }
  }

  const query = useQuery<File, AxiosError>(
    // user.avatar and user.headerimage can be really undefined
    // and can be filtered, must pass imageType in key
    filterEmptyKeys([QueryKeys.IMAGE, userId, imageType, imageName]),
    () => getImage(imageUrl),
    {
      enabled: !!userId && !!imageUrl,
      suspense: false, // important for placeholders
    }
  );

  return query;
};
