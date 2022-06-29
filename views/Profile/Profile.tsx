import React, { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import moment from 'moment';
import { withBem } from 'utils/bem';
import PostItem from 'components/PostItem';
import {
  getAvatarPath,
  getHeaderImagePath,
  uploadsImageLoader,
} from 'lib-client/imageLoaders';
import { mommentFormats } from 'lib-server/constants';
import { ClientUser } from 'types/models/User';
import { usePosts } from 'lib-client/react-query/posts/usePosts';
import Pagination from 'components/Pagination';
import QueryKeys from 'lib-client/react-query/queryKeys';
import usePrevious from 'components/hooks/usePrevious';
import SearchInput from 'components/SearchInput';
import useCalcIsFetching from 'lib-client/react-query/useCalcIsFetching';
import NoItems from 'components/NoItems';
import useDecrementPage from 'components/hooks/useDecrementPage';

type ProfileProps = {
  profile: ClientUser;
};

const Profile: FC<ProfileProps> = ({ profile }) => {
  const b = withBem('profile');

  const [searchTerm, setSearchTerm] = useState('');
  const prevSearchTerm = usePrevious(searchTerm);

  const { username } = profile;
  const prevUsername = usePrevious(username);

  const [page, setPage] = useState(1);
  const { data, isFetching, isPreviousData } = usePosts(QueryKeys.POSTS_PROFILE, {
    page,
    username,
    ...(searchTerm && { searchTerm }),
  });

  useDecrementPage({
    page,
    total: data?.pagination?.total ?? 0,
    itemsType: 'posts',
    setPage,
  });

  // if profile page of another user reset to first page
  useEffect(() => {
    if (prevUsername !== username) {
      setPage(1);
    }
  }, [prevUsername, username]);

  useEffect(() => {
    if (prevSearchTerm !== searchTerm) {
      setPage(1);
    }
  }, [prevSearchTerm, searchTerm]);

  const isSearchFetching = useCalcIsFetching({
    isFetching,
    state: searchTerm,
  });

  const isPaginationFetching = useCalcIsFetching({
    isFetching,
    state: page,
  });

  if (!data) return null;

  return (
    <div className={b()}>
      <section className={b('user-card')}>
        <div className={b('header-image')}>
          <Image
            loader={uploadsImageLoader}
            layout="fill"
            src={getHeaderImagePath(profile)}
            alt={profile.name ?? 'name'}
            objectFit="cover"
            objectPosition="center"
          />
        </div>
        <div className={b('user-info')}>
          <div className={b('avatar-wrapper')}>
            <Image
              loader={uploadsImageLoader}
              src={getAvatarPath(profile)}
              width={112}
              height={112}
              alt={profile.name ?? 'cover'}
              objectFit="cover"
            />
          </div>
          <h1 className={b('name')}>{profile.name}</h1>
          <p className={b('username')}>{`@${profile.username}`}</p>
          <p className={b('bio')}>{profile.bio}</p>
          <p className={b('date')}>{`Joined ${moment(profile.createdAt).format(
            mommentFormats.dateForUsersAndPosts
          )}`}</p>
          {/* count messages, comments, followers */}
        </div>
      </section>

      <div className={b('pagination-search')}>
        <Pagination
          onPreviousClick={() => setPage((oldPage) => Math.max(oldPage - 1, 1))}
          onNextClick={() => {
            if (!isPreviousData && data.pagination.hasMore) {
              setPage((oldPage) => oldPage + 1);
            }
          }}
          setPage={setPage}
          isPreviousDisabled={!!page && page === 1}
          isNextDisabled={isPreviousData || !data?.pagination.hasMore}
          currentPage={page}
          pagesCount={data.pagination.pagesCount}
          isFetching={isPaginationFetching}
          from={data.pagination.from}
          to={data.pagination.to}
          total={data.pagination.total}
        />
        <SearchInput onSearchSubmit={setSearchTerm} isFetching={isSearchFetching} />
      </div>

      <section className={b('list')}>
        {data.items.length > 0 ? (
          data.items.map((post) => <PostItem key={post.id} post={post} />)
        ) : (
          <NoItems />
        )}
      </section>
    </div>
  );
};

export default Profile;
