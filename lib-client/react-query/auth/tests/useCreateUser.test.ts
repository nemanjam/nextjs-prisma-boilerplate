import { renderHook } from '@testing-library/react-hooks';
import { createWrapper } from 'test/test-utils';
import { useCreateUser, UserCreateType } from 'lib-client/react-query/auth/useCreateUser';
import { fakeUser } from 'test/server/fake-data';
import { createMockRouter } from 'test/Wrapper';
import { Routes } from 'lib-client/constants';

describe('useCreateUser', () => {
  test('successful create mutation hook', async () => {
    const username = 'createdUsername';

    const router = createMockRouter({
      push: jest.fn(),
    });

    const { result, waitFor } = renderHook(() => useCreateUser(), {
      wrapper: createWrapper({ router }),
    });

    const { mutate } = result.current;

    const mutationVariables: UserCreateType = {
      username,
      name: fakeUser.name,
      email: fakeUser.email,
      password: 'password',
    };
    mutate(mutationVariables);

    await waitFor(() => result.current.isSuccess);

    // data is response on success
    expect(result.current.data.username).toBe(username);

    // assert redirect /auth/login onSuccess
    expect(router.push).toHaveBeenCalledWith(Routes.SITE.LOGIN);
  });
});
