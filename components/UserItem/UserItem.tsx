import React, { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import moment from 'moment';
import { withBem } from 'utils/bem';
import {
  getAvatarPath,
  getHeaderImagePath,
  uploadsImageLoader,
} from 'lib-client/imageLoaders';
import { getIsAdmin } from 'components/PostItem';
import Button from 'components/Button';
import { useDeleteUser } from 'lib-client/react-query/users/useDeleteUser';
import { useMe } from 'lib-client/react-query/auth/useMe';
import { mommentFormats } from 'lib-server/constants';
import { ClientUser } from 'types';
import { Routes } from 'lib-client/constants';
import Alert from 'components/Alert';
import Loading from 'components/Loading';

type UserItemProps = {
  user: ClientUser;
};

const UserItem: FC<UserItemProps> = ({ user }) => {
  const { me, isLoadingMe } = useMe();
  const b = withBem('user-item');

  const { mutate: deleteUser, ...restDelete } = useDeleteUser();

  if (isLoadingMe || !user) return <Loading isItem />;

  const userHref = {
    pathname: '/[username]',
    query: { username: user.username },
  };

  // use this instead of {pathname, query} to prevent hard refresh
  const settingsHref = `${Routes.SITE.SETTINGS}${user.username}/`;

  const isAdmin = getIsAdmin(me);

  return (
    <section className={b()}>
      {restDelete.isError && <Alert variant="error" message={restDelete.error.message} />}

      <div className={b('header-image')}>
        <Image
          loader={uploadsImageLoader}
          layout="fill"
          src={getHeaderImagePath(user)}
          alt="header image"
          objectFit="cover"
          objectPosition="center"
        />
      </div>
      <div className={b('user-info')}>
        <span className={b('avatar-container-1')}>
          <span className={b('avatar-container-2')}>
            <Link href={userHref}>
              <a>
                <Image
                  loader={uploadsImageLoader}
                  src={getAvatarPath(user)}
                  width={80}
                  height={80}
                  alt={user.name}
                  objectFit="cover"
                />
              </a>
            </Link>
          </span>
        </span>

        <div className={b('first-row')}>
          <Link href={userHref}>
            <a>
              <h2 className={b('name')}>{user.name}</h2>
            </a>
          </Link>

          <div className={b('buttons')}>
            {isAdmin && (
              <>
                <Link href={settingsHref}>
                  <a>
                    <Button tagName="span">Edit</Button>
                  </a>
                </Link>
                <Button
                  data-testid="delete-button"
                  variant="secondary"
                  onClick={() => {
                    deleteUser(user.id);
                  }}
                >
                  {!restDelete.isLoading ? 'Delete' : 'Deleting...'}
                </Button>
              </>
            )}
          </div>
        </div>

        <div>
          <Link href={userHref}>
            <a>
              <span className={b('username')}>{`@${user.username}`}</span>
            </a>
          </Link>
        </div>
        <p className={b('bio')}>{user.bio}</p>
        <p className={b('date')}>{`Joined ${moment(user.createdAt).format(
          mommentFormats.dateForUsersAndPosts
        )}`}</p>
        {/* count messages, comments, followers */}
      </div>
    </section>
  );
};

export default UserItem;
