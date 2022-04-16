import { renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from 'test/test-utils';
import { usePost } from 'lib-client/react-query/posts/usePost';
import { fakePostWithAuthor } from 'test/server/fake-data';

describe('usePost', () => {
  test('successful query post hook', async () => {
    const { result } = renderHook(() => usePost(fakePostWithAuthor.id), {
      wrapper: createWrapper(),
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data.title).toBe(fakePostWithAuthor.title);
  });
});
