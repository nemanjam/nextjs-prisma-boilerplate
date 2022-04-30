import { fakeServerUser } from 'test-client/server/fake-data';
import { prismaMock } from 'test-server/singleton';

test('should create new user ', async () => {
  prismaMock.user.create.mockResolvedValue(fakeServerUser);
  /*
  const user = createUser(fakeServerUser);

  await expect().resolves.toEqual({
    id: 1,
    name: 'Rich',
    email: 'hello@prisma.io',
  });
  */
});
