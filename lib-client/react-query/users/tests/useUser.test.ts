import { renderHook, waitFor, screen } from '@testing-library/react';
import { createWrapper } from 'test-client/test-utils';
import { useUser } from 'lib-client/react-query/users/useUser';
import { fakeUser } from 'test-client/server/fake-data';
import { UserGetData } from 'types/models/User';
import { errorHandlerGet500, errorMessage500 } from 'test-client/server/handlers/error';

describe('useUser hook', () => {
  test('successful query user hook', async () => {
    const params: UserGetData = { username: fakeUser.username };

    const { result } = renderHook(() => useUser(params), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.username).toBe(fakeUser.username);
  });

  test('fail 500 query user hook', async () => {
    const mockedConsoleError = jest.spyOn(console, 'error').mockImplementation();

    const params: UserGetData = { username: fakeUser.username };

    // override with GET 500 runtime handler
    errorHandlerGet500();

    renderHook(() => useUser(params), {
      wrapper: createWrapper(),
    });

    // renders Loader and ErrorBoundary from Wrapper
    // uses ErrorBoundary, isError is undefined
    // queries: { suspense: true, useErrorBoundary: true }
    // assert ErrorBoundary and message and not result.current.isError
    const errorBoundaryMessage = await screen.findByTestId(/error-boundary/i);
    expect(errorBoundaryMessage).toHaveTextContent(errorMessage500);

    mockedConsoleError.mockRestore();
  });
});
