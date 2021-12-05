import React from 'react';
import { useRouter } from 'next/router';
import { Routes } from 'lib-client/constants';
import { UserStr, PostStr } from 'types/utils';
import Link from 'next/link';

export type PostWithAuthor = PostStr & {
  author: UserStr;
};

export type PostProps = {
  post: PostWithAuthor;
};

const Post: React.FC<PostProps> = ({ post }) => {
  const router = useRouter();

  return (
    <div
      onClick={() =>
        router.push({
          pathname: `/[username]${Routes.SITE.POST}[id]`,
          query: { username: post.author.username, id: post.id },
        })
      }
    >
      <h2>{post.title}</h2>
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
      <small>On {post.updatedAt}</small>
      <p>{post.content} </p>

      <style jsx>{`
        div {
          color: inherit;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
};

export default Post;
