import React from 'react';
import Router from 'next/router';
import axios from 'axios';
import { PostWithAuthorStr } from 'types';
import { Routes } from 'lib-client/constants';
import Link from 'next/link';
import { withBem } from 'utils/bem';
import { getAvatarPath } from 'utils';
import moment from 'moment';

type PostProps = {
  post: PostWithAuthorStr;
  isOwner: boolean;
};

const Post: React.FC<PostProps> = ({ post, isOwner }) => {
  const b = withBem('post');

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

  const { author } = post;

  const authorHref = {
    pathname: '/[username]',
    query: { username: author.username },
  };

  const title = `${post.title} ${post.published ? '' : '(Draft)'}`;

  return (
    <article className={b()}>
      <div className={b('hero')}>
        <img
          className={b('hero-image')}
          src="https://wilcity.com/wp-content/uploads/2020/03/39875853-header-wallpapers.jpg"
        />

        {'isOwner' && (
          <div className={b('publish-delete')}>
            {'!post.published ' && (
              <button onClick={() => publishOrDeletePost(post.id, 'publish')}>
                Publish
              </button>
            )}
            <button onClick={() => publishOrDeletePost(post.id, 'delete')}>Delete</button>
          </div>
        )}
      </div>

      <h2 className={b('title')}>{title}</h2>
      {/* category, tags */}

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
            {moment(post.createdAt).format('MMMM d, YYYY')}
          </div>
        </div>
      </div>

      <div className={b('content')}>{post.content}</div>
    </article>
  );
};

export default Post;
