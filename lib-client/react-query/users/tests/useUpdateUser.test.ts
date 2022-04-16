import { renderHook } from '@testing-library/react-hooks';
import { createWrapper } from 'test/test-utils';
import { useUpdateUser } from 'lib-client/react-query/users/useUpdateUser';
import { fakeUser } from 'test/server/fake-data';
import { UserUpdateMutationData } from 'types/models/User';

describe('useUpdateUser', () => {
  test('successful update user mutation hook', async () => {
    const username = 'updatedUsername';

    const { result, waitFor } = renderHook(() => useUpdateUser(), {
      wrapper: createWrapper(),
    });

    const { mutate } = result.current;

    const mutationVariables: UserUpdateMutationData = {
      id: fakeUser.id,
      user: { ...fakeUser, username },
      setProgress: jest.fn(), // onUploadProgress undefined msw, not supported in msw
    };
    mutate(mutationVariables);

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data.username).toBe(username);
  });
});
