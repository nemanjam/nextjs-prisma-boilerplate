import { renderHook, waitFor, screen } from '@testing-library/react';
import { createWrapper } from 'test/test-utils';
import { useUser } from 'lib-client/react-query/users/useUser';
import { fakeUser } from 'test/server/fake-data';
import { UserGetQueryParams } from 'types/models/User';
import { errorHandler500, errorMessage500 } from 'test/server';

describe('useUser hook', () => {
  test('successful query user hook', async () => {
    const params: UserGetQueryParams = { username: fakeUser.username };

    const { result } = renderHook(() => useUser(params), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data.username).toBe(fakeUser.username);
  });

  test('fail 500 query user hook', async () => {
    const mockedConsoleError = jest.spyOn(console, 'error').mockImplementation();

    const params: UserGetQueryParams = { username: fakeUser.username };

    // return 500 from msw
    errorHandler500();
    renderHook(() => useUser(params), {
      wrapper: createWrapper(),
    });

    // uses ErrorBoundary, isError is undefined
    // queries: { suspense: true, useErrorBoundary: true }
    // assert ErrorBoundary and message and not result.current.isError
    const errorBoundaryMessage = await screen.findByTestId(/error\-boundary\-test/i);
    expect(errorBoundaryMessage).toHaveTextContent(errorMessage500);

    mockedConsoleError.mockRestore();
  });
});
