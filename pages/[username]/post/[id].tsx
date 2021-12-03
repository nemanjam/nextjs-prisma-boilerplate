import React from 'react';
import { GetServerSideProps } from 'next';
import Layout from 'components/Layout';
import Router from 'next/router';
import axios from 'axios';
import { PostProps } from 'components/Post';
import prisma from 'lib-server/prisma';
import { useSession } from 'next-auth/react';
import { Routes } from 'lib-client/constants';

async function publishPost(id: number): Promise<void> {
  try {
    await axios.patch(`${Routes.API.POSTS}${id}`, { published: true });
  } catch (error) {
    console.error(error);
  }
  await Router.push(Routes.SITE.HOME);
}

async function deletePost(id: number): Promise<void> {
  try {
    await axios.delete(`${Routes.API.POSTS}${id}`);
  } catch (error) {
    console.error(error);
  }
  await Router.push(Routes.SITE.HOME);
}

const Post: React.FC<PostProps> = (props) => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  if (loading) {
    return <div>Authenticating ...</div>;
  }
  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === props.author?.email;
  let title = props.title;
  if (!props.published) {
    title = `${title} (Draft)`;
  }

  return (
    <Layout>
      <div>
        <h2>{title}</h2>
        <p>By {props?.author?.name || 'Unknown author'}</p>
        <p>{props.content} </p>
        {!props.published && userHasValidSession && postBelongsToUser && (
          <button onClick={() => publishPost(props.id)}>Publish</button>
        )}
        {userHasValidSession && postBelongsToUser && (
          <button onClick={() => deletePost(props.id)}>Delete</button>
        )}
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }

        button {
          background: #ececec;
          border: 0;
          border-radius: 0.125rem;
          padding: 1rem 2rem;
        }

        button + button {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: Number(params?.id) || -1,
    },
    include: {
      author: {
        select: {
          name: true,
          username: true,
        },
      },
    },
  });

  return {
    props: post,
  };
};

export default Post;
