import React, { FC } from 'react';
import Link from 'next/link';
import moment from 'moment';
import { withBem } from 'utils/bem';
import { getAvatarPath, getHeaderImagePath } from 'utils';
import { getIsAdmin } from 'components/PostItem';
import Button from 'components/Button';
import { useDeleteUser } from 'lib-client/react-query/posts/useDeleteUser';
import { useMe } from 'lib-client/react-query/auth/useMe';
import { mommentFormats } from '@lib-server/constants';
import { ClientUser } from 'types';

type UserItemProps = {
  user: ClientUser;
};

const UserItem: FC<UserItemProps> = ({ user }) => {
  const { me } = useMe();
  const b = withBem('user-item');

  const { mutate: deleteUser, ...restDelete } = useDeleteUser();

  const authorHref = {
    pathname: '/[username]',
    query: { username: user.username },
  };

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
        <Link href={authorHref}>
          <a>
            <img className={b('avatar')} src={getAvatarPath(user)} />
          </a>
        </Link>
        <h1 className={b('name')}>{user.name}</h1>
        <p className={b('username')}>{user.username}</p>
        <p className={b('bio')}>{user.bio}</p>
        <p className={b('date')}>{`Joined ${moment(user.createdAt).format(
          mommentFormats.dateForUsersAndPosts
        )}`}</p>
        {/* count messages, comments, followers */}
      </div>

      {isAdmin && (
        <Button
          variant="danger"
          onClick={(e) => {
            e.stopPropagation();
            deleteUser(user.id);
          }}
        >
          {!restDelete.isLoading ? 'Delete' : 'Deleting...'}
        </Button>
      )}
    </section>
  );
};

export default UserItem;
