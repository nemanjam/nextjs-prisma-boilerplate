import { renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from 'test/test-utils';
import { fakePost } from 'test/server/fake-data';
import { createMockRouter } from 'test/Wrapper';
import { Routes } from 'lib-client/constants';
import { useCreatePost } from 'lib-client/react-query/posts/useCreatePost';
import { PostCreateData } from 'types/models/Post';

describe('useCreatePost', () => {
  // same as auth/useCreateUser
  test('successful create post mutation hook', async () => {
    const title = 'createdTitle';

    const router = createMockRouter({
      push: jest.fn(),
    });

    const { result } = renderHook(() => useCreatePost(), {
      wrapper: createWrapper({ router }),
    });

    const { mutate } = result.current;

    const mutationVariables: PostCreateData = {
      title,
      content: fakePost.content,
    };
    mutate(mutationVariables);

    await waitFor(() => result.current.isSuccess);

    // data is response on success, like in query
    expect(result.current.data.title).toBe(title);

    // assert redirect /post/drafts onSuccess
    expect(router.push).toHaveBeenCalledWith(Routes.SITE.DRAFTS);

    jest.clearAllMocks();
  });
});
