import React from 'react';
import { GetServerSideProps } from 'next';
import Layout from 'components/Layout';
import Router from 'next/router';
import axios from 'axios';
import { PostProps } from 'components/Post';
import prisma from 'lib-server/prisma';
import { useSession } from 'next-auth/react';
import { Routes } from 'lib-client/constants';
import { datesToStrings } from 'utils';
import Link from 'next/link';

const publishOrDeletePost = async (
  id: number,
  action: 'publish' | 'delete'
): Promise<void> => {
  try {
    switch (action) {
      case 'publish':
        await axios.patch(`${Routes.API.POSTS}${id}`, { published: true });
        break;
      case 'delete':
        await axios.delete(`${Routes.API.POSTS}${id}`);
        break;
    }
  } catch (error) {
    console.error(error);
  }
  await Router.push(Routes.SITE.HOME);
};

const Post: React.FC<PostProps> = ({ post }) => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  if (loading) {
    return <div>Authenticating ...</div>;
  }

  const isOwner = session && session.user?.id === post.author?.id;
  const title = `${post.title} ${post.published ? '' : '(Draft)'}`;

  return (
    <Layout>
      <div>
        <h2>{title}</h2>
        <small>
          By
          <Link href={`/${post.author.username}`}>
            <a>{post.author.name}</a>
          </Link>
        </small>
        <p>{post.content} </p>

        {!post.published && isOwner && (
          <button onClick={() => publishOrDeletePost(post.id, 'publish')}>Publish</button>
        )}
        {isOwner && (
          <button onClick={() => publishOrDeletePost(post.id, 'delete')}>Delete</button>
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
      author: true,
    },
  });

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: { post: datesToStrings({ ...post, author: datesToStrings(post.author) }) },
  };
};

export default Post;
