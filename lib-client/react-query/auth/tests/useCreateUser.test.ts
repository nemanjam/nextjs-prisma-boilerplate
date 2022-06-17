import { renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from 'test-client/test-utils';
import { useCreateUser } from 'lib-client/react-query/auth/useCreateUser';
import { fakeUser } from 'test-client/server/fake-data';
import { createMockRouter } from 'test-client/Wrapper';
import { Routes } from 'lib-client/constants';
import { UserCreateData } from 'types/models/User';
import { errorHandlerPost500, errorMessage500 } from 'test-client/server/handlers/error';

describe('useCreateUser', () => {
  test('successful create mutation hook', async () => {
    const username = 'createdUsername';

    const router = createMockRouter({
      push: jest.fn(),
    });

    const { result } = renderHook(() => useCreateUser(), {
      wrapper: createWrapper({ router }),
    });

    const { mutate } = result.current;

    const mutationVariables: UserCreateData = {
      username,
      name: fakeUser.name,
      email: fakeUser.email,
      password: 'password',
    };
    mutate(mutationVariables);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // data is response on success
    expect(result.current.data?.username).toBe(username);

    // assert redirect /auth/login onSuccess
    expect(router.push).toHaveBeenCalledWith(Routes.SITE.LOGIN);
  });

  test('fail 500 create mutation hook', async () => {
    const mockedConsoleError = jest.spyOn(console, 'error').mockImplementation();

    // override with POST 500 runtime handler
    errorHandlerPost500();

    const { result } = renderHook(() => useCreateUser(), {
      wrapper: createWrapper(),
    });

    const { mutate } = result.current;

    const mutationVariables: UserCreateData = {
      username: fakeUser.username,
      name: fakeUser.name,
      email: fakeUser.email,
      password: 'password',
    };
    mutate(mutationVariables);

    await waitFor(() => expect(result.current.isError).toBe(true));

    // assert error message
    expect(result.current.error?.message).toBe(errorMessage500);

    mockedConsoleError.mockRestore();
  });
});
