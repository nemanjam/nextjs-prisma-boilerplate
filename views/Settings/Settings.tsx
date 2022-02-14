import { useState, useEffect, FC } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { DropzoneOptions } from 'react-dropzone';
import { userUpdateSchema } from 'lib-server/validation';
import DropzoneSingle from 'components/DropzoneSingle';
import { useQueryClient } from 'react-query';
import { getErrorClass, withBem } from 'utils/bem';
import Button from 'components/Button';
import {
  getImage,
  UserUpdateType,
  useUpdateUser,
} from 'lib-client/react-query/users/useUpdateUser';
import { useUser } from 'lib-client/react-query/users/useUser';
import { Routes } from 'lib-client/constants';
import { getAvatarPath, getHeaderImagePath } from 'lib-client/imageLoaders';
import { ClientUser } from 'types';
import { useMe } from 'lib-client/react-query/auth/useMe';
import QueryKeys from 'lib-client/react-query/queryKeys';
import ProgressBar from 'components/ProgressBar';
import Alert from 'components/Alert';

// don't put id in form, validation  needs to diff on client and server
// id is in route param
interface SettingsFormData {
  name: string;
  username: string;
  avatar: File;
  header: File;
  bio: string;
  password: string;
  confirmPassword: string;
}

// admin can edit other users
const Settings: FC = () => {
  const [progress, setProgress] = useState(0);
  const b = withBem('settings');

  const router = useRouter();
  const queryClient = useQueryClient();

  const { me, isLoadingMe } = useMe();

  const id = me?.id;
  const { username } = router.query;
  const params = username?.length > 0 ? { username: username[0] } : { id };

  const { data: user, isLoading, isFetching } = useUser(params);

  useEffect(() => {
    if (!id && router) router.push(Routes.SITE.LOGIN);
  }, [id, router]);

  useEffect(() => {
    let timer = null;
    if (progress > 99) {
      timer = setTimeout(() => setProgress(0), 2000);
    }
    return () => {
      timer && clearTimeout(timer);
    };
  }, [progress, setProgress]);

  const methods = useForm<SettingsFormData>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      username: user.username,
      name: user.name,
      bio: user.bio,
      avatar: undefined,
      header: undefined,
      password: '',
      confirmPassword: '',
    },
  });

  // set initial value for avatar, header async
  // images should be in form state and not in React Query state
  useEffect(() => {
    const run = async (user: ClientUser) => {
      const avatarUrl = getAvatarPath(user);
      const headerUrl = getHeaderImagePath(user);
      const avatar = await getImage(avatarUrl);
      const header = await getImage(headerUrl);

      reset({
        ...getValues(),
        avatar,
        header,
      } as SettingsFormData);
    };

    if (user) {
      run(user);
    }
  }, [user]);

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

  const {
    mutateAsync: updateUser,
    isLoading: isUpdateLoading,
    isError,
    error,
  } = useUpdateUser();

  const onSubmit = async (data: SettingsFormData) => {
    if (Object.keys(dirtyFields).length === 0) return;

    const updatedFields = {} as UserUpdateType;
    Object.keys(data).forEach((key) => {
      // send only dirty fileds
      if (Object.keys(dirtyFields).includes(key) && !['confirmPassword'].includes(key)) {
        updatedFields[key] = data[key];
      }
    });

    await updateUser({ id: user.id, user: updatedFields, setProgress });
    await queryClient.invalidateQueries(QueryKeys.ME);
  };

  if (isLoading || isLoadingMe) return <h2>Loading...</h2>;
  if (!getValues('avatar') || !getValues('header')) return <div>Loading...</div>;

  return (
    <FormProvider {...methods}>
      <form className={b()} onSubmit={handleSubmit(onSubmit)}>
        <h1 className={b('title')}>{!isFetching ? 'Settings' : 'Settings...'}</h1>

        {isError && <Alert variant="error" message={error.message} />}

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
          <Button type="submit">{!isUpdateLoading ? 'Submit' : 'Submiting...'}</Button>
          <Button variant="secondary" onClick={() => reset()}>
            Reset
          </Button>
        </div>
        <ProgressBar progress={progress} />
      </form>
    </FormProvider>
  );
};

export default Settings;
