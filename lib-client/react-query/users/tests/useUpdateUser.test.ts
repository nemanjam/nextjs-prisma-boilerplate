import { renderHook } from '@testing-library/react-hooks';
import { createWrapper } from 'test/test-utils';
import {
  UserUpdateFormType,
  useUpdateUser,
} from 'lib-client/react-query/users/useUpdateUser';
import { fakeUser } from 'test/server/fake-data';

describe('useUpdateUser', () => {
  test('successful mutation hook', async () => {
    const username = 'updatedUsername';

    const { result, waitFor } = renderHook(() => useUpdateUser(), {
      wrapper: createWrapper(),
    });

    const { mutate } = result.current;

    const mutationVariables: UserUpdateFormType = {
      id: fakeUser.id,
      user: { ...fakeUser, username },
      setProgress: jest.fn(), // onUploadProgress undefined msw
    };
    mutate(mutationVariables);

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data.username).toBe(fakeUser.username);
  });
});
