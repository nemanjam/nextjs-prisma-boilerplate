import React, { FC } from 'react';
import Link from 'next/link';
import moment from 'moment';
import { withBem } from 'utils/bem';
import { getAvatarPath, getHeaderImagePath } from 'utils';
import { getIsAdmin } from 'components/PostItem';
import Button from 'components/Button';
import { useDeleteUser } from 'lib-client/react-query/users/useDeleteUser';
import { useMe } from 'lib-client/react-query/auth/useMe';
import { mommentFormats } from '@lib-server/constants';
import { ClientUser } from 'types';
import { Routes } from 'lib-client/constants';

type UserItemProps = {
  user: ClientUser;
};

const UserItem: FC<UserItemProps> = ({ user }) => {
  const { me } = useMe();
  const b = withBem('user-item');

  const { mutate: deleteUser, ...restDelete } = useDeleteUser();

  const userHref = {
    pathname: '/[username]',
    query: { username: user.username },
  };

  // use this instead of {pathname, query} to prevent hard refresh
  const settingsHref = `${Routes.SITE.SETTINGS}${user.username}/`;

  const isAdmin = getIsAdmin(me);

  return (
    <section className={b()}>
      {restDelete.isError && (
        <div className="alert-error">{restDelete.error.message}</div>
      )}

      <div
        className={b('header-image')}
        style={{ backgroundImage: `url('${getHeaderImagePath(user)}')` }}
      />
      <div className={b('user-info')}>
        <span className={b('avatar-container')}>
          <Link href={userHref}>
            <a>
              <img className={b('avatar')} src={getAvatarPath(user)} />
            </a>
          </Link>
        </span>

        <div className={b('buttons')}>
          {isAdmin && (
            <>
              <Link href={settingsHref}>
                <a>
                  <Button tagName="span">Edit</Button>
                </a>
              </Link>
              <Button
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

        <Link href={userHref}>
          <a>
            <h2 className={b('name')}>{user.name}</h2>
          </a>
        </Link>
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
