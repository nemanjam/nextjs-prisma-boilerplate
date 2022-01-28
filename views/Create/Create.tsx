import React, { FC } from 'react';
import Link from 'next/link';
import { getErrorClass, withBem } from 'utils/bem';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Routes } from 'lib-client/constants';
import { postCreateSchema } from 'lib-server/validation';
import Button from 'components/Button';
import {
  PostCreateType,
  useCreatePost,
} from 'lib-client/react-query/posts/useCreatePost';

const Create: FC = () => {
  const b = withBem('create');

  const { mutate: createPost, isLoading, isError, error } = useCreatePost();

  const onSubmit = async ({ title, content }: PostCreateType) => {
    createPost({ title, content });
  };

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(postCreateSchema),
  });
  const { errors } = formState;

  return (
    <form className={b()} onSubmit={handleSubmit(onSubmit)}>
      <h1 className={b('title')}>Create new draft</h1>

      {isError && <div className="alert-error">{error.message}</div>}

      <div className={b('form-field')}>
        <label htmlFor="title">Title</label>
        <input
          {...register('title')}
          id="title"
          autoFocus
          type="text"
          className={getErrorClass(errors.title?.message)}
        />
        <p className={getErrorClass(errors.title?.message)}>{errors.title?.message}</p>
      </div>

      <div className={b('form-field')}>
        <label htmlFor="content">Content</label>
        <textarea
          {...register('content')}
          id="content"
          rows={8}
          className={getErrorClass(errors.content?.message)}
        />
        <p className={getErrorClass(errors.content?.message)}>
          {errors.content?.message}
        </p>
      </div>

      <div className={b('buttons')}>
        <Button type="submit" disabled={isLoading}>
          {!isLoading ? 'Create' : 'Submiting...'}
        </Button>
        <span>or</span>
        <Link href={Routes.SITE.HOME}>
          <a className={b('cancel')}>Cancel</a>
        </Link>
      </div>
    </form>
  );
};

export default Create;
