import React from 'react';
import { useRouter } from 'next/router';
import { UserStr, PostStr } from 'types/utils';
import Link from 'next/link';
import moment from 'moment';
import { Routes } from 'lib-client/constants';
import { withBem } from 'utils/bem';
import { getAvatarPath } from 'utils';

export type PostWithAuthor = PostStr & {
  author: UserStr;
};

export type PostItemProps = {
  post: PostWithAuthor;
};

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  const router = useRouter();
  const b = withBem('post-item');

  const { author } = post;

  const postHref = {
    pathname: `/[username]${Routes.SITE.POST}[id]`,
    query: { username: author.username, id: post.id },
  };

  const handlePostClick = () => router.push(postHref);

  const authorHref = {
    pathname: '/[username]',
    query: { username: author.username },
  };

  return (
    <article className={b()} onClick={handlePostClick}>
      <div className={b('header')}>
        {/* avatar */}
        <div className={b('left')}>
          <Link href={authorHref}>
            <a>
              <img className={b('avatar')} src={getAvatarPath(author)} />
            </a>
          </Link>
        </div>

        {/* title */}
        <div className={b('right')}>
          <h4 className={b('post-title')}>{post.title}</h4>

          <div className={b('user-title')}>
            <Link href={authorHref}>
              <a className={b('name')}>{author.name}</a>
            </Link>
            <Link href={authorHref}>
              <a className={b('username')}>{author.username}</a>
            </Link>
            <Link href={postHref}>
              <a className={b('post-created-at')}>{moment(post.createdAt).fromNow()}</a>
            </Link>
          </div>
        </div>
      </div>

      {/* content */}
      <div className={b('content')}>{post.content}</div>
    </article>
  );
};

export default PostItem;
