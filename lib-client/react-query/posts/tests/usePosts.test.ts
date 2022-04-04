import { renderHook } from '@testing-library/react-hooks';
import { createWrapper } from 'test/test-utils';
import { usePosts } from 'lib-client/react-query/posts/usePosts';
import { fakePosts } from 'test/server/fake-data';
import QueryKeys from 'lib-client/react-query/queryKeys';
import { GetPostsQueryParams } from 'pages/api/posts';

describe('usePosts', () => {
  test('successful query posts hook', async () => {
    const page = 1;
    const title = fakePosts.items[0].title; // msw supports only title

    const params: GetPostsQueryParams = { page, searchTerm: title };

    const { result, waitFor } = renderHook(() => usePosts(QueryKeys.POSTS_HOME, params), {
      wrapper: createWrapper(),
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data.pagination.currentPage).toBe(page);
    expect(result.current.data.pagination.total).toBe(1);
    expect(result.current.data.items[0].title).toBe(title);
  });
});
