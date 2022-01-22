import React, { useState } from 'react';
import { withBem } from 'utils/bem';
import PostItem from 'components/PostItem';
import { usePosts } from 'lib-client/react-query/posts/usePosts';

const Home: React.FC = () => {
  const b = withBem('home');

  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, isPreviousData } = usePosts(page);

  if (isLoading) return <h2>Loading...</h2>;

  return (
    <div className={b()}>
      <h1 className={b('title')}>Home</h1>

      <div className={b('pagination')}>
        <button
          onClick={() => setPage((oldPage) => Math.max(oldPage - 1, 1))}
          disabled={page === 0}
        >
          Previous Page
        </button>
        <span>Current Page: {page}</span>
        <button
          onClick={() => {
            if (!isPreviousData && data.pagination.hasMore) {
              setPage((oldPage) => oldPage + 1);
            }
          }}
          disabled={isPreviousData || !data?.pagination.hasMore}
        >
          Next Page
        </button>
        {isFetching && <span> Loading...</span>}
      </div>

      <div className={b('list')}>
        {data.items.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Home;
