import { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DropzoneOptions } from 'react-dropzone';
import { Routes } from 'lib-client/constants';
import { userUpdateSchema } from 'lib-server/validation';
import { getAvatarFullUrl } from 'utils';
import DropzoneAvatar from 'components/DropzoneAvatar';
import { UserStr } from 'types';
import { getErrorClass, withBem } from 'utils/bem';

type Props = {
  user: UserStr;
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
  const b = withBem('settings');

  const methods = useForm<SettingsFormData>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      username: user.username,
      name: user.name,
      bio: user.bio,
      avatar: undefined,
      password: '',
    },
  });

  const dropzoneOptions: DropzoneOptions = {
    accept: 'image/png, image/jpg, image/jpeg',
    noDrag: false,
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
    <FormProvider {...methods}>
      <form className={b()} onSubmit={handleSubmit(onSubmit)}>
        <h1 className={b('title')}>Settings</h1>

        <div className={b('form-field', { input: true })}>
          <label htmlFor="username">Username</label>
          <input
            {...register('username')}
            id="username"
            type="text"
            className={getErrorClass(errors.username?.message)}
          />
          <p className={getErrorClass(errors.username?.message)}>
            {errors.username?.message}
          </p>
        </div>

        <div className={b('form-field', { input: true })}>
          <label htmlFor="name">Name</label>
          <input
            {...register('name')}
            id="name"
            type="text"
            className={getErrorClass(errors.name?.message)}
          />
          <p className={getErrorClass(errors.name?.message)}>{errors.name?.message}</p>
        </div>

        <div className={b('form-field', { avatar: true })}>
          <DropzoneAvatar
            name="avatar"
            label="Avatar"
            dropzoneOptions={dropzoneOptions}
          />
          {progress > 0 && progress}
          <p className={getErrorClass(errors.avatar?.message)}>
            {errors.avatar?.message}
          </p>
        </div>

        <div className={b('form-field', { bio: true })}>
          <label htmlFor="bio">Bio</label>
          <textarea
            {...register('bio')}
            id="bio"
            rows={2}
            className={getErrorClass(errors.bio?.message)}
          />
          <p className={getErrorClass(errors.bio?.message)}>{errors.bio?.message}</p>
        </div>

        <div className={b('form-field', { input: true })}>
          <label htmlFor="password">Password</label>
          <input
            {...register('password')}
            id="password"
            type="password"
            className={getErrorClass(errors.password?.message)}
          />
          <p className={getErrorClass(errors.password?.message)}>
            {errors.password?.message}
          </p>
        </div>

        <div className={b('buttons')}>
          <button type="submit">Submit</button>
        </div>
      </form>
    </FormProvider>
  );
};

export default Settings;
