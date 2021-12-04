import React from 'react';
import Router from 'next/router';
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
  return (
    <div
      onClick={() =>
        Router.push(
          `/[username]${Routes.SITE.POST}[id]`,
          `${post.author.username}${Routes.SITE.POST}${post.id}`
        )
      }
    >
      <h2>{post.title}</h2>
      <small>
        By
        <Link href={`/${post.author.username}`}>
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
