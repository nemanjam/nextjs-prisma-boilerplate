import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import axios from 'axios';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DropzoneOptions } from 'react-dropzone';
import prisma from 'lib-server/prisma';
import { Routes } from 'lib-client/constants';
import { userUpdateSchema } from 'lib-server/validation';
import { datesToStrings, getAvatarFullUrl } from 'utils';
import { User } from '@prisma/client';
import DropzoneAvatar from 'components/DropzoneAvatar';
import Layout from 'components/Layout';

type Props = {
  user: User;
};

interface SettingsFormData {
  name: string;
  username: string;
  avatar: File;
  bio: string;
  password: string;
}

const Settings: React.FC<Props> = ({ user }) => {
  const [progress, setProgress] = useState(0);

  const methods = useForm<SettingsFormData>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      username: user.username,
      name: user.name,
      avatar: undefined,
      password: '',
    },
  });

  const dropzoneOptions: DropzoneOptions = {
    accept: 'image/png, image/jpg, image/jpeg',
    noDrag: true,
    multiple: false,
    maxFiles: 1,
    // minSize: 10 * 1024, // sets undefined, not good...
    // maxSize: 1 * 1024 * 1024, // 1MB
    // validator: ...
  };

  const { register, handleSubmit, formState, setValue } = methods;
  const { errors, dirtyFields } = formState;

  const setDefaultAvatar = async (avatarUrl: string) => {
    const response = await axios.get(avatarUrl, { responseType: 'blob' });
    const avatarFile = new File([response.data], 'defaultAvatar');
    setValue('avatar', avatarFile);
  };

  // set initial value for avatar async
  useEffect(() => {
    if (user) {
      const url = getAvatarFullUrl(user);
      setDefaultAvatar(url);
    }
  }, [user]);

  const onSubmit = async (data: SettingsFormData) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      // send only dirty fileds
      if (Object.keys(dirtyFields).includes(key)) {
        formData.append(key, data[key]);
      }
    });

    const config = {
      headers: { 'content-type': 'multipart/form-data' },
      onUploadProgress: (event: ProgressEvent) => {
        const _progress = Math.round((event.loaded * 100) / event.total);
        setProgress(_progress);
      },
    };

    try {
      await axios.patch(`${Routes.API.USERS}${user.id}`, formData, config);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="username">Username</label>
            <input id="username" type="text" {...register('username')} />
            <p className="has-error">{errors.username?.message}</p>
          </div>

          <div>
            <label htmlFor="name">Name</label>
            <input id="name" type="text" {...register('name')} />
            <p className="has-error">{errors.name?.message}</p>
          </div>

          <div>
            <DropzoneAvatar name="avatar" dropzoneOptions={dropzoneOptions} />
            {progress > 0 && progress}
            <p className="has-error">{errors.avatar?.message}</p>
          </div>

          <div>
            <label htmlFor="bio">Bio</label>
            <input id="bio" type="text" {...register('bio')} />
            <p className="has-error">{errors.bio?.message}</p>
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input id="password" type="password" {...register('password')} />
            <p className="has-error">{errors.password?.message}</p>
          </div>

          <button type="submit">Submit</button>
        </form>
      </FormProvider>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  const redirect = {
    redirect: {
      permanent: false,
      destination: Routes.SITE.LOGIN,
    },
  };

  if (!session) {
    return redirect;
  }

  // not all user fields are available in session.user
  const user = await prisma.user.findUnique({
    where: { username: session.user.username },
  });

  if (!user) {
    return redirect;
  }

  return {
    props: {
      user: datesToStrings(user),
    },
  };
};

export default Settings;
