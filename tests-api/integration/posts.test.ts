import { testClient, teardown } from 'test-server/test-client';
import indexHandler from 'pages/api/posts';
import idHandler from 'pages/api/posts/[id]';
import { Routes } from 'lib-client/constants';
import { fakePostWithAuthor } from 'test-client/server/fake-data';
import { PostCreateData, PostUpdateData } from 'types/models/Post';
import prisma from 'lib-server/prisma';
import { createUser } from 'lib-server/services/users';
import { ClientUser } from 'types/models/User';
import * as usersService from 'lib-server/services/users';

describe('Posts', () => {
  let createdUser: ClientUser;
  let mockedGetMeService: jest.SpyInstance<Promise<ClientUser | null>>;

  beforeAll(async () => {
    // create user in db for post.author and logged in mock
    const { username, email, name } = fakePostWithAuthor.author;
    createdUser = await createUser({ username, email, name, password: '123456' });

    // mock logged in user
    // todo: maybe this is possible without mock, manipulate req object
    mockedGetMeService = jest.spyOn(usersService, 'getMe').mockResolvedValue(createdUser);
  });

  afterAll(async () => {
    // clean up mocks
    mockedGetMeService.mockRestore();
    // clear db data
    await teardown();
  });

  test('create new post success', async () => {
    // prepare controller args
    fakePostWithAuthor.author = createdUser;
    const { author, title, content } = fakePostWithAuthor;
    const postData: PostCreateData = { title, content };

    // act
    const request = testClient(indexHandler);
    const { statusCode, body } = await request.post(Routes.API.POSTS).send(postData);

    // query db
    const createdPostWithAuthor = await prisma.post.findFirst({
      where: { title },
      include: { author: true },
    });

    // assert http response
    expect(statusCode).toBe(201);
    // match response
    expect(body).toEqual(
      expect.objectContaining({
        title,
        content,
        // match nested author
        author: expect.objectContaining({
          id: author.id,
        }),
      })
    );

    // assert db entry
    expect(createdPostWithAuthor).toEqual(
      expect.objectContaining({
        title,
        content,
        // match nested author
        author: expect.objectContaining({
          id: author.id,
        }),
      })
    );

    // getMe called 2 times
    expect(mockedGetMeService).toHaveBeenCalled();
  });

  test('update post success', async () => {
    // prepare controller args
    fakePostWithAuthor.author = createdUser;

    const { author, title: createdTitle, content } = fakePostWithAuthor;
    const createPostData: PostCreateData = { title: createdTitle, content };

    // prepare, create post in db with id
    const request = testClient(indexHandler);
    const { body: post } = await request.post(Routes.API.POSTS).send(createPostData);

    // prepare args
    const title = 'Updated title';
    const updatePostData: PostUpdateData = { title };

    // act
    // pass id like this again
    const requestId = testClient(idHandler, { id: post.id.toString() });
    // post owner, it should work
    const { statusCode, body } = await requestId
      .patch(Routes.API.POSTS)
      .send(updatePostData);

    // query db
    const updatedPostWithAuthor = await prisma.post.findFirst({
      where: { title },
      include: { author: true },
    });

    // assert http response
    expect(statusCode).toBe(200);
    // match response
    expect(body).toEqual(
      expect.objectContaining({
        title,
        // match nested author
        author: expect.objectContaining({
          id: author.id,
        }),
      })
    );

    // assert db entry
    expect(updatedPostWithAuthor).toEqual(
      expect.objectContaining({
        title,
        // match nested author
        author: expect.objectContaining({
          id: author.id,
        }),
      })
    );

    // getMe called 2 times
    expect(mockedGetMeService).toHaveBeenCalled();
  });
});
