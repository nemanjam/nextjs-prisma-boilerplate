import React from 'react';
import { getErrorClass, withBem } from 'utils/bem';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Routes } from 'lib-client/constants';
import { postCreateSchema } from 'lib-server/validation';
import Button from 'components/Button';

const Create: React.FC = () => {
  const router = useRouter();
  const b = withBem('create');

  const onSubmit = async ({ title, content }) => {
    try {
      await axios.post(Routes.API.POSTS, { title, content });
      // swr and handle server error
      await router.push(Routes.SITE.DRAFTS);
    } catch (error) {
      console.error(error);
    }
  };

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(postCreateSchema),
  });
  const { errors } = formState;

  return (
    <form className={b()} onSubmit={handleSubmit(onSubmit)}>
      <h1 className={b('title')}>Create new draft</h1>

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
        <Button type="submit">Create</Button>
        <span>or</span>
        <Link href={Routes.SITE.HOME}>
          <a className={b('cancel')}>Cancel</a>
        </Link>
      </div>
    </form>
  );
};

export default Create;
