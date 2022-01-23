import React, { useState } from 'react';
import { withBem } from 'utils/bem';
import PostItem from 'components/PostItem';
import Pagination from 'components/Pagination';
import { usePosts } from 'lib-client/react-query/posts/usePosts';

const Home: React.FC = () => {
  const b = withBem('home');

  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, isPreviousData } = usePosts(page);

  if (isLoading) return <h2>Loading...</h2>;

  return (
    <div className={b()}>
      <h1 className={b('title')}>Home</h1>

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

export default Home;
