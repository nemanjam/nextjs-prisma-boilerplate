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
import { getAvatarPath, getHeaderImagePath } from 'lib-client/imageLoaders';
import { ClientUser } from 'types';
import { useMe } from 'lib-client/react-query/auth/useMe';
import QueryKeys from 'lib-client/react-query/queryKeys';
import ProgressBar from 'components/ProgressBar';
import Alert from 'components/Alert';
import Loading from 'components/Loading';
import { useIsMounted } from 'components/hooks';

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

  const isMounted = useIsMounted();

  const [isAvatarLoading, setIsAvatarLoading] = useState(true);
  const [isHeaderLoading, setIsHeaderLoading] = useState(true);

  const router = useRouter();
  const queryClient = useQueryClient();

  const { me, isLoadingMe } = useMe();

  const id = me?.id;
  const { username } = router.query;
  const isOtherUser = username?.length > 0;
  const params = isOtherUser ? { username: username[0] } : { id };

  const { data: user, isLoading } = useUser(params);

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
      username: '',
      name: '',
      bio: '',
      avatar: undefined,
      header: undefined,
      password: '',
      confirmPassword: '',
    },
  });

  const { register, handleSubmit, formState, reset, getValues } = methods;
  const { errors, dirtyFields } = formState;

  // async load user too
  useEffect(() => {
    if (!isLoading && user) {
      reset({
        ...getValues(),
        username: user.username,
        name: user.name,
        bio: user.bio,
      } as SettingsFormData);
    }
  }, [user, isLoading]);

  const avatarFile = getValues('avatar');
  const headerFile = getValues('header');

  // set initial value for avatar, header async
  // images should be in form state and not in React Query state
  useEffect(() => {
    const runAvatar = async (user: ClientUser) => {
      try {
        const avatarUrl = getAvatarPath(user);
        const avatar = await getImage(avatarUrl);

        reset({
          ...getValues(),
          avatar,
        } as SettingsFormData);

        isMounted && setIsAvatarLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    const runHeader = async (user: ClientUser) => {
      try {
        const headerUrl = getHeaderImagePath(user);
        const header = await getImage(headerUrl);

        reset({
          ...getValues(),
          header,
        } as SettingsFormData);

        isMounted && setIsHeaderLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    if (!avatarFile && isAvatarLoading && user) {
      runAvatar(user);
    }

    if (!headerFile && isHeaderLoading && user) {
      runHeader(user);
    }
  }, [user, avatarFile, headerFile, isAvatarLoading, isHeaderLoading, isMounted]);

  const dropzoneOptions: DropzoneOptions = {
    accept: 'image/png, image/jpg, image/jpeg',
    noDrag: false,
    multiple: false,
    maxFiles: 1,
    // minSize: 10 * 1024, // sets undefined, not good...
    // maxSize: 1 * 1024 * 1024, // 1MB
    // validator: ...
  };

  const {
    mutate: updateUser,
    isLoading: isUpdateLoading,
    isError,
    error,
  } = useUpdateUser();

  const onSubmit = (data: SettingsFormData) => {
    if (Object.keys(dirtyFields).length === 0) return;

    const updatedFields = {} as UserUpdateType;
    Object.keys(data).forEach((key) => {
      // send only dirty fileds
      if (Object.keys(dirtyFields).includes(key) && !['confirmPassword'].includes(key)) {
        updatedFields[key] = data[key];
      }
    });

    updateUser(
      { id: user.id, user: updatedFields, setProgress },
      {
        onSuccess: async (user) => {
          if (isOtherUser) {
            await queryClient.invalidateQueries([QueryKeys.USER, user.username]);
          } else {
            await Promise.all([
              queryClient.invalidateQueries([QueryKeys.USER, user.id]),
              queryClient.invalidateQueries(QueryKeys.ME),
            ]);
          }
        },
      }
    );
  };

  if (isLoading || isLoadingMe) return <Loading />;

  return (
    <FormProvider {...methods}>
      <form className={b()} onSubmit={handleSubmit(onSubmit)}>
        <h1 className={b('title')}>Settings</h1>

        {isError && <Alert variant="error" message={error.message} />}

        <div className={b('form-field', { header: true })}>
          {!isHeaderLoading ? (
            <DropzoneSingle
              name="header"
              label="Header"
              imageClassName="max-h-44"
              altText="header-image"
              dropzoneOptions={dropzoneOptions}
            />
          ) : (
            <div data-testid="header-placeholder" className={b('header-placeholder')} />
          )}
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
          {!isAvatarLoading ? (
            <DropzoneSingle
              name="avatar"
              label="Avatar"
              altText="avatar-image"
              dropzoneOptions={dropzoneOptions}
            />
          ) : (
            <div data-testid="avatar-placeholder" className={b('avatar-placeholder')} />
          )}
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
