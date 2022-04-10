import React, { FC, useEffect, useState } from 'react';
import { withBem } from 'utils/bem';
import PostItem from 'components/PostItem';
import Pagination from 'components/Pagination';
import NoItems from 'components/NoItems';
import { usePosts } from 'lib-client/react-query/posts/usePosts';
import QueryKeys from 'lib-client/react-query/queryKeys';
import SearchInput from 'components/SearchInput';
import usePrevious from 'components/hooks/usePrevious';
import PreviewTheme from 'components/PreviewTheme';
import useCalcIsFetching from 'lib-client/react-query/useCalcIsFetching';
import Loading from 'components/Loading';
import useDecrementPage from 'components/hooks/useDecrementPage';

const Home: FC = () => {
  const b = withBem('home');

  const [searchTerm, setSearchTerm] = useState('');
  const prevSearchTerm = usePrevious(searchTerm);

  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, isPreviousData } = usePosts(QueryKeys.POSTS_HOME, {
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
    itemsType: 'posts',
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
      <h1 className={b('title')}>Home</h1>

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
        {/* <PreviewTheme /> */}
        {data.items.length > 0 ? (
          data.items.map((post) => <PostItem key={post.id} post={post} />)
        ) : (
          <NoItems />
        )}
      </section>
    </div>
  );
};

export default Home;
