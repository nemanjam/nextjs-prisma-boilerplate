import { useState, useEffect, FC, useContext } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { DropzoneOptions } from 'react-dropzone';
import { userUpdateSchema } from 'lib-server/validation';
import DropzoneSingle from 'components/DropzoneSingle';
import { useQueryClient } from 'react-query';
import { getErrorClass, withBem } from 'utils/bem';
import Button from 'components/Button';
import { useUpdateUser } from 'lib-client/react-query/users/useUpdateUser';
import { useUser } from 'lib-client/react-query/users/useUser';
import QueryKeys from 'lib-client/react-query/queryKeys';
import ProgressBar from 'components/ProgressBar';
import Alert from 'components/Alert';
import { MeContext } from 'lib-client/providers/Me';
import {
  UserUpdateData,
  UserUpdateFormData,
  UserUpdateDataKeys,
} from 'types/models/User';
import { useImage } from 'lib-client/react-query/users/useImage';

// admin can edit other users
const Settings: FC = () => {
  const [progress, setProgress] = useState(0);
  const b = withBem('settings');

  const [hasRanOnce, setHasRanOnce] = useState(false);

  const router = useRouter();
  const queryClient = useQueryClient();

  const { me } = useContext(MeContext);

  const id = me?.id;
  const username = router.query?.username?.[0];
  const isOtherUser = !!username;
  const params = isOtherUser ? { username } : { id };

  const { data: user } = useUser(params);
  // dependant queries
  const { data: avatarFile, isLoading: isAvatarLoading } = useImage(user, 'avatar');
  const { data: headerFile, isLoading: isHeaderLoading } = useImage(user, 'header');

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (progress > 99) {
      timer = setTimeout(() => setProgress(0), 1200);
    }
    return () => {
      timer && clearTimeout(timer);
    };
  }, [progress, setProgress]);

  const methods = useForm<UserUpdateFormData>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      username: '',
      name: '',
      bio: '',
      avatar: null, // undefined must not be initial value, he said in github issues
      header: null,
      password: '',
      confirmPassword: '',
    },
  });

  const { register, handleSubmit, formState, reset, getValues } = methods;
  const { errors, dirtyFields } = formState;

  useEffect(() => {
    // load everything at once when ready
    if (!hasRanOnce && user && avatarFile && headerFile) {
      reset({
        ...getValues(),
        username: user.username,
        name: user.name,
        bio: user.bio || '', // handle null
        avatar: avatarFile,
        header: headerFile,
      } as UserUpdateFormData);

      setHasRanOnce(true);
    }
  }, [user, avatarFile, headerFile, hasRanOnce]);

  const {
    mutate: updateUser,
    isLoading: isUpdateLoading,
    isError,
    error,
  } = useUpdateUser();

  const dropzoneOptions: DropzoneOptions = {
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
    noDrag: false,
    multiple: false,
    maxFiles: 1,
    // minSize: 10 * 1024, // sets undefined, not good...
    // maxSize: 1 * 1024 * 1024, // 1MB
    // validator: ...
  };

  const onSubmit = (data: UserUpdateFormData) => {
    if (Object.keys(dirtyFields).length === 0) return;

    const updatedFields = {} as UserUpdateData;
    Object.keys(data).forEach((key) => {
      // send only dirty fileds
      if (Object.keys(dirtyFields).includes(key) && !['confirmPassword'].includes(key)) {
        const _key = key as UserUpdateDataKeys;
        updatedFields[_key] = data[_key] as any;
      }
    });

    if (!user) return;

    updateUser(
      { id: user.id, user: updatedFields, setProgress },
      {
        onSuccess: async (user) => {
          if (isOtherUser) {
            await queryClient.invalidateQueries([QueryKeys.USER, user.username]);
          } else {
            await Promise.all([
              queryClient.invalidateQueries([QueryKeys.USER, user.id]),
              queryClient.invalidateQueries([QueryKeys.ME]),
            ]);
          }
          // refetch both images always
          await queryClient.invalidateQueries([QueryKeys.IMAGE, user.id]);
        },
      }
    );
  };

  return (
    <div className={b()}>
      <h1 className={b('title')}>Settings</h1>

      <FormProvider {...methods}>
        <form className={b('form')} onSubmit={handleSubmit(onSubmit)}>
          {isError && <Alert variant="error" message={error.message} />}

          <div className={b('form-field', { header: true })}>
            {!isHeaderLoading ? (
              <DropzoneSingle
                name="header"
                label="Header"
                imageClassName="max-h-44"
                altText="header-image"
                dropzoneOptions={dropzoneOptions}
                data-testid="header-loaded"
              />
            ) : (
              <div className={b('header-placeholder')} />
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
                data-testid="avatar-loaded"
              />
            ) : (
              <div className={b('avatar-placeholder')} />
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
              autoComplete="new-password"
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
    </div>
  );
};

export default Settings;
