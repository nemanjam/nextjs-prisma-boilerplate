import React from 'react';
import Router from 'next/router';
import axios from 'axios';
import { PostItemProps } from 'components/PostItem';
import { useSession } from 'next-auth/react';
import { Routes } from 'lib-client/constants';
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

const Post: React.FC<PostItemProps> = ({ post }) => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  if (loading) {
    return <div>Authenticating ...</div>;
  }

  const isOwner = session && session.user?.id === post.author?.id;
  const title = `${post.title} ${post.published ? '' : '(Draft)'}`;

  return (
    <div>
      <article>
        <h2>{title}</h2>
        <small>
          By
          <Link
            href={{
              pathname: '/[username]',
              query: { username: post.author.username },
            }}
          >
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
      </article>

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
    </div>
  );
};

export default Post;
