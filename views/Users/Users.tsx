import React, { FC, useEffect, useState } from 'react';
import { withBem } from 'utils/bem';
import UserItem from 'components/UserItem';
import Pagination from 'components/Pagination';
import { useUsers } from 'lib-client/react-query/users/useUsers';
import SearchInput from 'components/SearchInput';
import usePrevious from 'components/hooks/usePrevious';
import useCalcIsFetching from 'lib-client/react-query/useCalcIsFetching';
import NoItems from 'components/NoItems';
import Loading from 'components/Loading';
import useDecrementPage from 'components/hooks/useDecrementPage';

const Users: FC = () => {
  const b = withBem('users');

  const [searchTerm, setSearchTerm] = useState('');
  const prevSearchTerm = usePrevious(searchTerm);

  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, isPreviousData } = useUsers({
    page,
    ...(searchTerm && { searchTerm }),
  });

  useEffect(() => {
    if (prevSearchTerm !== searchTerm) {
      setPage(1);
    }
  }, [prevSearchTerm, searchTerm]);

  useDecrementPage({
    page,
    total: data?.pagination?.total,
    itemsType: 'users',
    setPage,
  });

  const isSearchFetching = useCalcIsFetching({
    isFetching,
    state: searchTerm,
  });

  const isPaginationFetching = useCalcIsFetching({
    isFetching,
    state: page,
  });

  if (isLoading) return <Loading />;

  return (
    <div className={b()}>
      <h1 className={b('title')}>Users</h1>

      <div className={b('pagination-search')}>
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
          isFetching={isPaginationFetching}
          from={data.pagination.from}
          to={data.pagination.to}
          total={data.pagination.total}
        />
        <SearchInput onSearchSubmit={setSearchTerm} isFetching={isSearchFetching} />
      </div>

      <section className={b('list')}>
        {data.items.length > 0 ? (
          data.items.map((user) => <UserItem key={user.id} user={user} />)
        ) : (
          <NoItems itemsType="users" />
        )}
      </section>
    </div>
  );
};

export default Users;
