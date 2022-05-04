import { createUser } from 'lib-server/services/users';
import { fakeServerUser } from 'test-client/server/fake-data';
import { prismaMock } from 'test-server/singleton';
import { UserCreateData } from 'types/models/User';

test('should create new user ', async () => {
  prismaMock.user.create.mockResolvedValue(fakeServerUser);

  const resultUser = createUser(fakeServerUser as UserCreateData);

  await expect(resultUser).resolves.toEqual(fakeServerUser);
});
