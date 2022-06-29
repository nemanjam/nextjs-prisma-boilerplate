import React, { FC, useContext, useState } from 'react';
import { withBem } from 'utils/bem';
import PostItem from 'components/PostItem';
import { usePosts } from 'lib-client/react-query/posts/usePosts';
import Pagination from 'components/Pagination';
import QueryKeys from 'lib-client/react-query/queryKeys';
import NoItems from 'components/NoItems';
import useDecrementPage from 'components/hooks/useDecrementPage';
import { MeContext } from 'lib-client/providers/Me';

const Drafts: FC = () => {
  const b = withBem('drafts');
  const { me } = useContext(MeContext);

  const [page, setPage] = useState(1);
  const { data, isFetching, isPreviousData } = usePosts(QueryKeys.POSTS_DRAFTS, {
    page,
    username: me?.username,
    published: false,
  });

  useDecrementPage({
    page,
    total: data?.pagination?.total ?? 0,
    itemsType: 'posts',
    setPage,
  });

  if (!data) return null;

  return (
    <div className={b()}>
      <h1 className={b('title')}>My Drafts</h1>

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
        isFetching={isFetching}
        from={data.pagination.from}
        to={data.pagination.to}
        total={data.pagination.total}
      />

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

export default Drafts;
