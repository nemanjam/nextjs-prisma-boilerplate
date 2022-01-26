import { useState, useEffect, FC } from 'react';
import axios from 'axios';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DropzoneOptions } from 'react-dropzone';
import { Routes } from 'lib-client/constants';
import { userUpdateSchema } from 'lib-server/validation';
import { getAvatarPath, getHeaderImagePath } from 'utils';
import DropzoneSingle from 'components/DropzoneSingle';
import { ClientUser } from 'types';
import { getErrorClass, withBem } from 'utils/bem';
import Button from 'components/Button';
import {
  UserUpdateType,
  useUpdateUser,
} from 'lib-client/react-query/users/useUpdateUser';

type Props = {
  user: ClientUser;
};

interface SettingsFormData {
  id: string;
  name: string;
  username: string;
  avatar: File;
  header: File;
  bio: string;
  password: string;
  confirmPassword: string;
}

const Settings: FC<Props> = ({ user }) => {
  const [progress, setProgress] = useState(0);
  const b = withBem('settings');

  const methods = useForm<SettingsFormData>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      id: user.id,
      username: user.username,
      name: user.name,
      bio: user.bio,
      avatar: undefined,
      header: undefined,
      password: '',
      confirmPassword: '',
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

  const { register, handleSubmit, formState, reset, getValues } = methods;
  const { errors, dirtyFields } = formState;

  const { mutate: updateUser, isLoading, isError, error } = useUpdateUser();

  const getDefaultImageAsync = async (url: string) => {
    try {
      // works with relative path
      const response = await axios.get(url, { responseType: 'blob' });
      const file = new File([response.data], 'default-image');
      return file;
    } catch (error) {
      console.error(error);
    }
  };

  // set initial value for avatar, header async
  useEffect(() => {
    const run = async (user: ClientUser) => {
      const avatarUrl = getAvatarPath(user);
      const headerUrl = getHeaderImagePath(user);
      const avatar = await getDefaultImageAsync(avatarUrl);
      const header = await getDefaultImageAsync(headerUrl);

      reset({
        ...getValues(),
        avatar,
        header,
      } as any);
    };

    if (user) {
      run(user);
    }
  }, [user]);

  const onSubmit = async (data: SettingsFormData) => {
    if (Object.keys(dirtyFields).length === 0) return;

    const updatedFields = {} as UserUpdateType;
    Object.keys(data).forEach((key) => {
      // send only dirty fileds
      if (
        Object.keys(dirtyFields).includes(key) &&
        !['id', 'confirmPassword'].includes(key)
      ) {
        updatedFields[key] = data[key];
      }
    });

    updateUser({ id: data.id, user: updatedFields, setProgress });
  };

  if (!getValues('avatar') || !getValues('header')) return <div>Loading...</div>;

  return (
    <FormProvider {...methods}>
      <form className={b()} onSubmit={handleSubmit(onSubmit)}>
        <h1 className={b('title')}>Settings</h1>

        {isError && <div className="alert-error">{error.message}</div>}

        <input {...register('id')} type="hidden" />

        <div className={b('form-field', { header: true })}>
          <DropzoneSingle
            name="header"
            label="Header"
            imageClassName="max-h-44"
            dropzoneOptions={dropzoneOptions}
          />
          <p className={getErrorClass(errors.header?.message)}>
            {errors.header?.message}
          </p>
        </div>

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
          <DropzoneSingle
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

        <div className={b('form-field', { input: true })}>
          <label htmlFor="confirm-password">Confirm password</label>
          <input
            {...register('confirmPassword')}
            id="confirm-password"
            type="password"
            className={getErrorClass(errors.confirmPassword?.message)}
          />
          <p className={getErrorClass(errors.confirmPassword?.message)}>
            {errors.confirmPassword?.message}
          </p>
        </div>

        <div className={b('buttons')}>
          <Button type="submit">{!isLoading ? 'Submit' : 'Submiting...'}</Button>
          <Button variant="secondary" onClick={() => reset()}>
            Reset
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default Settings;
