import React, { useState } from 'react';
import moment from 'moment';
import { withBem } from 'utils/bem';
import PostItem from 'components/PostItem';
import { getAvatarPath, getHeaderImagePath } from 'utils';
import { mommentFormats } from '@lib-server/constants';
import { User } from '@prisma/client';
import { usePosts } from 'lib-client/react-query/posts/usePosts';
import Pagination from 'components/Pagination';

type ProfileProps = {
  profile: User;
};

const Profile: React.FC<ProfileProps> = ({ profile }) => {
  const b = withBem('profile');

  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, isPreviousData } = usePosts(page);

  if (isLoading) return <h2>Loading...</h2>;

  return (
    <div className={b()}>
      <section className={b('user-card')}>
        <div
          className={b('header-image')}
          style={{ backgroundImage: `url('${getHeaderImagePath(profile)}')` }}
        />
        <div className={b('user-info')}>
          <img className={b('avatar')} src={getAvatarPath(profile)} />
          <h1 className={b('name')}>{profile.name}</h1>
          <p className={b('username')}>{profile.username}</p>
          <p className={b('bio')}>{profile.bio}</p>
          <p className={b('date')}>{`Joined ${moment(profile.createdAt).format(
            mommentFormats.dateForUsersAndPosts
          )}`}</p>
          {/* count messages, comments, followers */}
        </div>
      </section>

      <Pagination
        onPreviousClick={() => setPage((oldPage) => Math.max(oldPage - 1, 1))}
        onNextClick={() => {
          if (!isPreviousData && data.pagination.hasMore) {
            setPage((oldPage) => oldPage + 1);
          }
        }}
        setPage={setPage}
        isPreviousDisabled={page === 1}
        isNextDisabled={isPreviousData || !data?.pagination.hasMore}
        currentPage={page}
        pagesCount={data.pagination.pagesCount}
        isFetching={isFetching}
        from={data.pagination.from}
        to={data.pagination.to}
        total={data.pagination.total}
      />

      <section className={b('list')}>
        {data.items.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </section>
    </div>
  );
};

export default Profile;
