import React from 'react';
import { useRouter } from 'next/router';
import { UserStr, PostStr } from 'types/utils';
import Link from 'next/link';
import { Routes } from 'lib-client/constants';
import { withBem } from 'utils/bem';

export type PostWithAuthor = PostStr & {
  author: UserStr;
};

export type PostItemProps = {
  post: PostWithAuthor;
};

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  const router = useRouter();
  const b = withBem('post');

  const handlePostClick = () =>
    router.push({
      pathname: `/[username]${Routes.SITE.POST}[id]`,
      query: { username: post.author.username, id: post.id },
    });

  return (
    <article className={b()} onClick={handlePostClick}>
      {/* user card */}
      <div className={b('user-card')}>
        <div className={b('avatar')}></div>
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
      </div>

      {/* content */}
      <h2>{post.title}</h2>
      <small>On {post.updatedAt}</small>
      <p>{post.content} </p>
    </article>
  );
};

export default PostItem;
