import { renderHook } from '@testing-library/react-hooks';
import { createWrapper } from 'test/test-utils';
import { fakePost } from 'test/server/fake-data';
import { createMockRouter } from 'test/Wrapper';
import { Routes } from 'lib-client/constants';
import {
  useCreatePost,
  PostCreateType,
} from 'lib-client/react-query/posts/useCreatePost';

// same like auth/useCreateUser
describe('useCreatePost', () => {
  test('successful create mutation hook', async () => {
    const title = 'createdTitle';

    const router = createMockRouter({
      push: jest.fn(),
    });

    const { result, waitFor } = renderHook(() => useCreatePost(), {
      wrapper: createWrapper({ router }),
    });

    const { mutate } = result.current;

    const mutationVariables: PostCreateType = {
      title,
      content: fakePost.content,
    };
    mutate(mutationVariables);

    await waitFor(() => result.current.isSuccess);

    // data is response on success, like in query
    expect(result.current.data.title).toBe(title);

    // assert redirect /post/drafts onSuccess
    expect(router.push).toHaveBeenCalledWith(Routes.SITE.DRAFTS);
  });
});
