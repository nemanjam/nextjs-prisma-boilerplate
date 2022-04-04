import { renderHook } from '@testing-library/react-hooks';
import { createWrapper } from 'test/test-utils';
import { useDeletePost } from 'lib-client/react-query/posts/useDeletePost';
import { fakePostWithAuthor } from 'test/server/fake-data';

describe('useDeletePost', () => {
  // same as useDeleteUser
  test('successful delete post mutation hook', async () => {
    const postId = fakePostWithAuthor.id;

    const { result, waitFor } = renderHook(() => useDeletePost(), {
      wrapper: createWrapper(),
    });

    const { mutate } = result.current;
    mutate(postId);

    await waitFor(() => result.current.isSuccess);

    // assert returns deleted post
    expect(result.current.data.title).toBe(fakePostWithAuthor.title);
  });
});
