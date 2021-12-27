import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import moment from 'moment';
import { Routes } from 'lib-client/constants';
import { withBem } from 'utils/bem';
import { getAvatarPath } from 'utils';
import {
  PostProps,
  publishOrDeletePost,
  getIsAdmin,
  getIsPostOwner,
} from 'components/PostItem';
import Button from 'components/Button';

const PostItem: React.FC<PostProps> = ({ post }) => {
  const router = useRouter();
  const { data: session } = useSession();

  const b = withBem('post-item');

  const { author } = post;

  const postHref = {
    pathname: `/[username]${Routes.SITE.POST}[id]`,
    query: { username: author.username, id: post.id },
  };

  // maybe remove it
  const handlePostClick = (event: React.MouseEvent) => {
    const isInsideOfLink = (event.target as HTMLElement).closest('a');
    if (!isInsideOfLink) router.push(postHref);
  };

  const authorHref = {
    pathname: '/[username]',
    query: { username: author.username },
  };

  const isOwnerOrAdmin = getIsPostOwner(session, post) || getIsAdmin(session);

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
          <Link href={postHref}>
            <a className={b('post-title')}>
              <h2>{post.title}</h2>
            </a>
          </Link>

          <div className={b('user-title')}>
            <Link href={authorHref}>
              <a className={b('name')}>{author.name}</a>
            </Link>
            <Link href={authorHref}>
              <a className={b('username')}>{author.username}</a>
            </Link>
            <span className={b('post-created-at')}>
              {moment(post.createdAt).fromNow()}
            </span>
          </div>
        </div>
      </div>

      {/* content */}
      <div className={b('content')}>{post.content}</div>

      {isOwnerOrAdmin && (
        <div className={b('publish-delete')}>
          {!post.published && (
            <Button onClick={() => publishOrDeletePost(post.id, 'publish')}>
              Publish
            </Button>
          )}
          <Button variant="danger" onClick={() => publishOrDeletePost(post.id, 'delete')}>
            Delete
          </Button>
        </div>
      )}
    </article>
  );
};

export default PostItem;
