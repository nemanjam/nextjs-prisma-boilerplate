import React from 'react';
import { getErrorClass, withBem } from 'utils/bem';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Routes } from 'lib-client/constants';
import { postCreateSchema } from 'lib-server/validation';

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

      <label className={b('label') + getErrorClass(errors.title?.message)}>
        <span>Title</span>
        <input {...register('title')} autoFocus type="text" />
        <p>{errors.title?.message}</p>
      </label>

      <label className={b('label') + getErrorClass(errors.content?.message)}>
        <span>Content</span>
        <textarea {...register('content')} rows={8} />
        <p>{errors.content?.message}</p>
      </label>

      <div className={b('buttons')}>
        <button type="submit">Create</button>
        <span>or</span>
        <Link href={Routes.SITE.HOME}>
          <a className="back">Cancel</a>
        </Link>
      </div>
    </form>
  );
};

export default Create;
