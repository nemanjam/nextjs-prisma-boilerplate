import React, { FC } from 'react';
import Link from 'next/link';
import NextError from 'next/error';
import { getErrorClass, withBem } from 'utils/bem';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Routes } from 'lib-client/constants';
import { postCreateSchema } from 'lib-server/validation';
import Button from 'components/Button';
import { useCreatePost } from 'lib-client/react-query/posts/useCreatePost';
import { usePost } from 'lib-client/react-query/posts/usePost';
import { useUpdatePost } from 'lib-client/react-query/posts/useUpdatePost';

interface CreatePostFormData {
  title: string;
  content: string;
}

const Create: FC = () => {
  const b = withBem('create');
  const router = useRouter();

  const id = Number(router.query?.id?.[0]);
  const { data: post, isLoading } = usePost(id);
  const isUpdate = !!post;

  const { mutate: updatePost, ...restUpdate } = useUpdatePost();
  const { mutate: createPost, ...restCreate } = useCreatePost();

  const onSubmit = async ({ title, content }: CreatePostFormData) => {
    isUpdate
      ? updatePost({ id: post.id, post: { title, content } })
      : createPost({ title, content });
  };

  const { register, handleSubmit, formState } = useForm<CreatePostFormData>({
    resolver: zodResolver(postCreateSchema),
    defaultValues: {
      title: !isLoading ? post?.title : 'Loading...',
      content: !isLoading ? post?.content : 'Loading...',
    },
  });
  const { errors } = formState;

  if (id && !post) return <NextError statusCode={404} />;

  return (
    <form className={b()} onSubmit={handleSubmit(onSubmit)}>
      <h1 className={b('title')}>Create new draft</h1>

      {restCreate.isError && (
        <div className="alert-error">{restCreate.error.message}</div>
      )}

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
        <Button type="submit" disabled={restCreate.isLoading || restUpdate.isLoading}>
          {!isUpdate && (!restCreate.isLoading ? 'Create' : 'Submiting...')}
          {isUpdate && (!restUpdate.isLoading ? 'Update' : 'Submiting...')}
        </Button>
        <span>or</span>
        <a
          href=""
          onClick={(e) => {
            e.preventDefault();
            router.back();
          }}
          className={b('cancel')}
        >
          Cancel
        </a>
      </div>
    </form>
  );
};

export default Create;
