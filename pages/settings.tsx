import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import prisma from 'lib-server/prisma';
import { Routes } from 'lib-client/constants';
import { userUpdateSchema } from 'lib-server/validation';
import { datesToStrings, getAvatarPath } from 'utils';
import { User } from '@prisma/client';

type Props = {
  user: User;
};

const getFileFromUrl = (url: string): Promise<File> =>
  fetch(url)
    .then((e) => {
      return e.blob();
    })
    .then((blob) => {
      let b: any = blob;
      b.lastModifiedDate = new Date();
      b.name = '';
      return b as File;
    });

const Settings: React.FC<Props> = ({ user }) => {
  const [progress, setProgress] = useState(0);
  const avatar = [await getFileFromUrl(getAvatarPath(user))];

  const { register, handleSubmit, formState, watch, getValues } = useForm({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      username: user.username,
      name: user.name,
      avatar,
      password: '',
    },
  });

  const { errors, dirtyFields } = formState;
  const formAvatar = watch('avatar');
  const previewAvatar = URL.createObjectURL(formAvatar[0]);

  // needs File instead of FileList
  // new File(url) for initial value
  // const values = getValues();

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));

    const config = {
      headers: { 'content-type': 'multipart/form-data' },
      onUploadProgress: (event: ProgressEvent) => {
        const _progress = Math.round((event.loaded * 100) / event.total);
        setProgress(_progress);
      },
    };

    try {
      await axios.post(Routes.API.USERS, formData, config);
    } catch (error) {
      console.error(error);
    }
  };

  return (
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
        <label htmlFor="avatar">Avatar</label>
        <input id="avatar" accept="image/*" {...register('avatar')} type="file" />
      </div>
      <img
        src={previewAvatar}
        style={{ height: '100px', width: '100px', objectFit: 'cover' }}
      />
      {progress > 0 && progress}
      <p className="has-error">{errors.avatar?.message}</p>

      <div>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" {...register('password')} />
        <p className="has-error">{errors.password?.message}</p>
      </div>

      <button type="submit">Submit</button>
    </form>
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
