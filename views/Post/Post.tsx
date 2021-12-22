import React from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { withBem } from 'utils/bem';
import { getAvatarPath } from 'utils';
import moment from 'moment';
import {
  PostProps,
  getIsAdmin,
  getIsPostOwner,
  publishOrDeletePost,
} from 'components/PostItem';
import { mommentFormats } from '@lib-server/constants';

const Post: React.FC<PostProps> = ({ post }) => {
  const { data: session } = useSession();

  const b = withBem('post');

  const { author } = post;

  const authorHref = {
    pathname: '/[username]',
    query: { username: author.username },
  };

  const title = `${post.title} ${post.published ? '' : '(Draft)'}`;
  const isOwnerOrAdmin = getIsPostOwner(session, post) || getIsAdmin(session);

  return (
    <article className={b()}>
      <h2 className={b('title')}>{title}</h2>
      {/* category, tags */}

      <div className={b('author')}>
        {/* user avatar, name, username, post date */}
        <div className={b('author-card')}>
          <Link href={authorHref}>
            <a className={b('left')}>
              <img className={b('avatar')} src={getAvatarPath(author)} />
            </a>
          </Link>

          <div className={b('right')}>
            <div className={b('author-info')}>
              <Link href={authorHref}>
                <a className={b('name')}>{author.name}</a>
              </Link>
              <Link href={authorHref}>
                <a className={b('username')}>{` · @${author.username}`}</a>
              </Link>
            </div>

            <div className={b('post-created-at')}>
              {moment(post.createdAt).format(mommentFormats.dateForUsersAndPosts)}
            </div>
          </div>
        </div>

        <div className={b('buttons')}>
          {isOwnerOrAdmin && (
            <div className={b('publish-delete')}>
              {!post.published && (
                <button onClick={() => publishOrDeletePost(post.id, 'publish')}>
                  Publish
                </button>
              )}
              <button onClick={() => publishOrDeletePost(post.id, 'delete')}>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={b('content')}>{post.content}</div>
    </article>
  );
};

export default Post;
