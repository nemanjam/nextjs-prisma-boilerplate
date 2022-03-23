import React, { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { withBem } from 'utils/bem';
import moment from 'moment';
import { useRouter } from 'next/router';
import { getIsAdmin, getIsPostOwner } from 'components/PostItem';
import { getAvatarPath, uploadsImageLoader } from 'lib-client/imageLoaders';
import { mommentFormats } from 'lib-server/constants';
import Button from 'components/Button';
import { useUpdatePost } from 'lib-client/react-query/posts/useUpdatePost';
import { useDeletePost } from 'lib-client/react-query/posts/useDeletePost';
import { usePost } from 'lib-client/react-query/posts/usePost';
import { Routes } from 'lib-client/constants';
import { useMe } from 'lib-client/react-query/auth/useMe';
import Alert from 'components/Alert';
import Loading from 'components/Loading';

const Post: FC = () => {
  const b = withBem('post');

  const { me, isLoadingMe } = useMe();
  const router = useRouter();
  // getServerSideProps will validate id
  const id = Number(router.query?.id);

  // redirect on delete
  const { data: post, isLoading, isFetching } = usePost(id);

  const { mutate: updatePost, ...restUpdate } = useUpdatePost();
  const { mutate: deletePost, ...restDelete } = useDeletePost();

  // must be here for post to be defined below
  if (isLoading || isLoadingMe) return <Loading />;

  const { author } = post;

  const authorHref = {
    pathname: '/[username]',
    query: { username: author.username },
  };

  const editPostHref = `${Routes.SITE.CREATE}${post.id}/`;

  const title = `${post.title} ${post.published ? '' : '(Draft)'}`;
  const isOwnerOrAdmin = getIsPostOwner(me, post) || getIsAdmin(me);

  return (
    <article className={b()}>
      {restUpdate.isError && <Alert variant="error" message={restUpdate.error.message} />}

      {restDelete.isError && <Alert variant="error" message={restDelete.error.message} />}

      <h1 className={b('title')}>{title}</h1>
      {/* category, tags */}

      <div className={b('author')}>
        {/* user avatar, name, username, post date */}
        <div className={b('author-card')}>
          <Link href={authorHref}>
            <a className={b('left')}>
              <Image
                loader={uploadsImageLoader}
                src={getAvatarPath(author)}
                width={80}
                height={80}
                alt={author.name}
                objectFit="cover"
              />
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
                <Button
                  onClick={() => updatePost({ id: post.id, post: { published: true } })}
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
                onClick={async () => {
                  deletePost(post.id, {
                    onSuccess: async () => await router.push(Routes.SITE.HOME),
                  });
                }}
              >
                {!restDelete.isLoading || isFetching ? 'Delete' : 'Deleting...'}
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className={b('content')}>{post.content}</div>
    </article>
  );
};

export default Post;
