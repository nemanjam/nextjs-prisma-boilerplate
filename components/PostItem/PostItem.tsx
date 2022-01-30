import React, { FC } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import moment from 'moment';
import { Routes } from 'lib-client/constants';
import { withBem } from 'utils/bem';
import { getAvatarPath } from 'utils';
import { PostProps, getIsAdmin, getIsPostOwner } from 'components/PostItem';
import Button from 'components/Button';
import { useUpdatePost } from 'lib-client/react-query/posts/useUpdatePost';
import { useDeletePost } from 'lib-client/react-query/posts/useDeletePost';
import { useMe } from 'lib-client/react-query/auth/useMe';

const PostItem: FC<PostProps> = ({ post }) => {
  const router = useRouter();
  const { me } = useMe();
  const b = withBem('post-item');

  const { mutate: updatePost, ...restUpdate } = useUpdatePost();
  const { mutate: deletePost, ...restDelete } = useDeletePost();

  const { author } = post;

  const postHref = {
    pathname: `/[username]${Routes.SITE.POST}[id]`,
    query: { username: author.username, id: post.id },
  };

  const editPostHref = `${Routes.SITE.CREATE}${post.id}/`;

  // maybe remove it
  const handlePostClick = (event: React.MouseEvent) => {
    const isInsideOfLink = (event.target as HTMLElement).closest('a');
    if (!isInsideOfLink) router.push(postHref);
  };

  const authorHref = {
    pathname: '/[username]',
    query: { username: author.username },
  };

  const isOwnerOrAdmin = getIsPostOwner(me, post) || getIsAdmin(me);

  return (
    <article className={b()} onClick={handlePostClick}>
      {restUpdate.isError && (
        <div className="alert-error">{restUpdate.error.message}</div>
      )}

      {restDelete.isError && (
        <div className="alert-error">{restDelete.error.message}</div>
      )}

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
              <a className={b('username')}>{`@${author.username}`}</a>
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
            <Button
              onClick={(e) => {
                e.stopPropagation();
                updatePost({ id: post.id, post: { published: true } });
              }}
            >
              {!restUpdate.isLoading ? 'Publish' : 'Submiting...'}
            </Button>
          )}

          <Link href={editPostHref}>
            <a>
              <Button tagName="span">Edit</Button>
            </a>
          </Link>

          <Button
            variant="danger"
            onClick={(e) => {
              e.stopPropagation();
              deletePost(post.id);
            }}
          >
            {!restDelete.isLoading ? 'Delete' : 'Deleting...'}
          </Button>
        </div>
      )}
    </article>
  );
};

export default PostItem;
