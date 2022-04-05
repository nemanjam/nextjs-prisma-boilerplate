import { renderHook } from '@testing-library/react-hooks';
import { createWrapper } from 'test/test-utils';
import {
  PostUpdateFormType,
  useUpdatePost,
} from 'lib-client/react-query/posts/useUpdatePost';
import { fakePostWithAuthor } from 'test/server/fake-data';

describe('useUpdatePost', () => {
  // same as useUpdateUser
  test('successful update post mutation hook', async () => {
    const title = 'updatedTitle';

    const { result, waitFor } = renderHook(() => useUpdatePost(), {
      wrapper: createWrapper(),
    });

    const { mutate } = result.current;

    const mutationVariables: PostUpdateFormType = {
      id: fakePostWithAuthor.id,
      post: { title, content: fakePostWithAuthor.content },
    };
    mutate(mutationVariables);

    await waitFor(() => result.current.isSuccess);

    // assert parsed FormData
    expect(result.current.data.title).toBe(title);
  });
});
