import React, { useState } from 'react';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Routes } from 'lib-client/constants';
import Layout from 'components/Layout';
import { postCreateSchema } from 'lib-server/validation';

const Create: React.FC = () => {
  const onSubmit = async ({ title, content }) => {
    try {
      await axios.post(Routes.API.POSTS, { title, content });
      // swr and handle server error
      await Router.push('/post/drafts');
    } catch (error) {
      console.error(error);
    }
  };

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(postCreateSchema),
  });
  const { errors } = formState;

  return (
    <Layout>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1>New Draft</h1>

          <input {...register('title')} autoFocus placeholder="Title" type="text" />
          <p className="has-error">{errors.title?.message}</p>

          <textarea {...register('content')} placeholder="Content" cols={50} rows={8} />
          <p className="has-error">{errors.content?.message}</p>

          <button type="submit">Create</button>

          <a className="back" href="#" onClick={() => Router.push('/')}>
            or Cancel
          </a>
        </form>
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 3rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        input[type='text'],
        textarea {
          width: 100%;
          padding: 0.5rem;
          margin: 0.5rem 0;
          border-radius: 0.25rem;
          border: 0.125rem solid rgba(0, 0, 0, 0.2);
        }

        button[type='submit'] {
          background: #ececec;
          border: 0;
          padding: 1rem 2rem;
        }

        button[disabled] {
          border: 1px solid red;
        }

        .has-error {
          color: red;
          font-size: 14px;
        }

        .back {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  );
};

export default Create;
