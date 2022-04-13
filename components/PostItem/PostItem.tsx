import React, { FC, useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import moment from 'moment';
import { Routes } from 'lib-client/constants';
import { withBem } from 'utils/bem';
import { PostProps, getIsAdmin, getIsPostOwner } from 'components/PostItem';
import Button from 'components/Button';
import { useUpdatePost } from 'lib-client/react-query/posts/useUpdatePost';
import { useDeletePost } from 'lib-client/react-query/posts/useDeletePost';
import Alert from 'components/Alert';
import { getAvatarPath, uploadsImageLoader } from 'lib-client/imageLoaders';
import Loading from 'components/Loading';
import { MeContext } from 'lib-client/providers/Me';

const PostItem: FC<PostProps> = ({ post }) => {
  const { me } = useContext(MeContext);
  const b = withBem('post-item');

  const { mutate: updatePost, ...restUpdate } = useUpdatePost();
  const { mutate: deletePost, ...restDelete } = useDeletePost();

  if (!post) return <Loading isItem />; // todo: fix this

  const { author } = post;

  const postHref = {
    pathname: `/[username]${Routes.SITE.POST}[id]`,
    query: { username: author.username, id: post.id },
  };

  const editPostHref = `${Routes.SITE.CREATE}${post.id}/`;

  const authorHref = {
    pathname: '/[username]',
    query: { username: author.username },
  };

  const isOwnerOrAdmin = getIsPostOwner(me, post) || getIsAdmin(me);

  const userInfo = (
    <>
      <Link href={authorHref}>
        <a className={b('name')}>{author.name}</a>
      </Link>
      <Link href={authorHref}>
        <a className={b('username')}>{`@${author.username}`}</a>
      </Link>
      <Link href={postHref}>
        <a className={b('time')}>{moment(post.updatedAt).fromNow()}</a>
      </Link>
    </>
  );

  return (
    <article className={b()}>
      {restUpdate.isError && <Alert variant="error" message={restUpdate.error.message} />}

      {restDelete.isError && <Alert variant="error" message={restDelete.error.message} />}

      <div className={b('header')}>
        {/* avatar */}
        <div className={b('left')}>
          <Link href={authorHref}>
            <a>
              <Image
                loader={uploadsImageLoader}
                src={getAvatarPath(author)}
                width={96}
                height={96}
                alt={author.name}
                objectFit="cover"
              />
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

          <div className={b('user-title-desktop')}>{userInfo}</div>
        </div>
      </div>

      <div className={b('user-title-mobile')}>{userInfo}</div>

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
            variant="secondary"
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
