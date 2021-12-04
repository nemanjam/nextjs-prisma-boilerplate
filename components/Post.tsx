import React from 'react';
import Router from 'next/router';
import { Routes } from 'lib-client/constants';
import { UserStr, PostStr } from 'types/utils';

export type PostWithAuthor = PostStr & {
  author: UserStr;
};

export type PostProps = PostWithAuthor;

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const authorName = post.author ? post.author.name : 'Unknown author';
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
      <small>By {authorName}</small>
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
