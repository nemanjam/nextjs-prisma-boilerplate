import { renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from 'test/test-utils';
import { useUpdatePost } from 'lib-client/react-query/posts/useUpdatePost';
import { fakePostWithAuthor } from 'test/server/fake-data';
import { PostUpdateMutationData } from 'types/models/Post';

describe('useUpdatePost', () => {
  // same as useUpdateUser
  test('successful update post mutation hook', async () => {
    const title = 'updatedTitle';

    const { result } = renderHook(() => useUpdatePost(), {
      wrapper: createWrapper(),
    });

    const { mutate } = result.current;

    const mutationVariables: PostUpdateMutationData = {
      id: fakePostWithAuthor.id,
      post: { title, content: fakePostWithAuthor.content },
    };
    mutate(mutationVariables);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // assert parsed FormData
    expect(result.current.data.title).toBe(title);
  });
});
