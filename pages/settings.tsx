import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Prisma } from '@prisma/client';
import prisma from 'lib-server/prisma';
import { Routes } from 'lib-client/constants';
import { userUpdateSchema } from 'lib-server/validation';

type Props = {
  user: Prisma.UserCreateInput;
};

const Settings: React.FC<Props> = ({ user }) => {
  const [progress, setProgress] = useState(0);

  const { register, handleSubmit, formState, watch, getValues } = useForm({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      username: user.username,
      name: user.name,
      avatar: user.image,
      password: '',
    },
  });

  const result = userUpdateSchema.safeParse({ password: '' });
  console.log('result', result);

  const { errors } = formState;
  const formAvatar = watch('avatar');
  // console.log('formAvatar', formAvatar);

  // needs File instead of FileList
  // new File(url) for initial value
  const values = getValues();
  console.log('values', values);

  const getAvatar = (formAvatar) => {
    // console.log('typeof', typeof formAvatar[0], formAvatar[0] instanceof File);

    return formAvatar === user.image
      ? `${process.env.NEXT_PUBLIC_AVATARS_PATH}${formAvatar || 'placeholder-avatar.jpg'}`
      : URL.createObjectURL(formAvatar[0]);
  };

  const previewAvatar = getAvatar(formAvatar);

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
        <input
          id="avatar"
          accept="image/*"
          // multiple={false}
          {...register('avatar')}
          type="file"
        />
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
  const username = session.user.username;

  // not all user fields are available in session.user
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: '/auth/login',
      },
    };
  }

  return {
    props: {
      user: {
        ...user,
        createdAt: user.createdAt.toISOString(), // dates not seriazable but needed
        updatedAt: user.updatedAt.toISOString(),
      },
    },
  };
};

export default Settings;
