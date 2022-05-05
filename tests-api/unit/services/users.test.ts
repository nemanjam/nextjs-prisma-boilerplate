import { createUser } from 'lib-server/services/users';
import { fakeServerUser } from 'test-client/server/fake-data';
import { prismaMock } from 'test-server/singleton';
import { UserCreateData } from 'types/models/User';
import ApiError from 'lib-server/error';

describe('Users service', () => {
  test('create new user success', async () => {
    prismaMock.user.create.mockResolvedValue(fakeServerUser);

    // arrange input args
    const { name, username, email } = fakeServerUser;
    const fakeUser: UserCreateData = {
      name,
      username,
      email,
      password: '123456',
    };

    // act
    const resultUser = await createUser(fakeUser);

    // remove password
    const { password: _, ...fakeClientUser } = fakeServerUser;

    // assert service return value
    expect(resultUser).toEqual(fakeClientUser);
  });

  test('creating user with existing email throws 409 ', async () => {
    // arrange user with existing email
    prismaMock.user.findFirst.mockResolvedValue(fakeServerUser);

    // create user with same email
    const { name, username, email } = fakeServerUser;
    const fakeUser: UserCreateData = {
      name,
      username,
      email,
      password: '123456',
    };

    // act
    const resultPromise = createUser(fakeUser);

    // assert rejected promise with 409 ApiError
    await expect(resultPromise).rejects.toMatchObject({ statusCode: 409 });
    await expect(resultPromise).rejects.toBeInstanceOf(ApiError);
  });
});
