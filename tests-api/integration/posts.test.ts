import { testClient, teardown } from 'test-server/test-client';
import indexHandler from 'pages/api/posts';
import idHandler from 'pages/api/posts/[id]';
import { Routes } from 'lib-client/constants';
import { fakePosts } from 'test-client/server/fake-data';
import { PostCreateData, PostUpdateData } from 'types/models/Post';
import prisma from 'lib-server/prisma';
import { createUser } from 'lib-server/services/users';
import { ClientUser } from 'types/models/User';
import * as usersService from 'lib-server/services/users';

describe('Posts', () => {
  let createdUser: ClientUser;
  let mockedGetMeService: jest.SpyInstance<Promise<ClientUser | null>>;

  beforeAll(async () => {
    // clear db data
    await teardown();

    // create user in db for post.author and logged in mock
    const { username, email, name } = fakePosts.items[0].author;
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
    // take first post
    const fakePost = fakePosts.items[0];
    // prepare controller args
    fakePost.author = createdUser;
    const { author, title, content } = fakePost;
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
    // take second post
    const fakePost = fakePosts.items[1];
    // prepare controller args
    fakePost.author = createdUser;

    const { author, title: createdTitle, content } = fakePost;
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
        author: expect.objectContaining({ id: author.id }),
      })
    );

    // getMe called 2 times
    expect(mockedGetMeService).toHaveBeenCalled();
  });

  test('get post by id success', async () => {
    // take third post
    const fakePost = fakePosts.items[2];
    // set author that exists in db
    fakePost.author = createdUser;

    const { author, title, content } = fakePost;
    const createPostData: PostCreateData = { title, content };

    // prepare, create post in db with id
    const request = testClient(indexHandler);
    const { body: post } = await request.post(Routes.API.POSTS).send(createPostData);

    // act
    // pass id like this again
    const requestId = testClient(idHandler, { id: post.id.toString() });
    const { statusCode, body } = await requestId.get(Routes.API.POSTS);

    // assert http response
    expect(statusCode).toBe(200);
    // match response
    expect(body).toEqual(
      expect.objectContaining({
        title,
        content,
        // match nested author
        author: expect.objectContaining({ id: author.id }),
      })
    );

    // dont check getMe, posts arent portected
  });

  test('delete post success', async () => {
    // take fourth post
    const fakePost = fakePosts.items[3];
    // set author that exists in db
    fakePost.author = createdUser;

    const title = 'Post to be deleted title';
    const { author, content } = fakePost;
    const createPostData: PostCreateData = { title, content };

    // prepare, create post in db with id
    const request = testClient(indexHandler);
    const { body: post } = await request.post(Routes.API.POSTS).send(createPostData);

    const createdPost = await prisma.post.findUnique({
      where: { id: post.id },
      include: { author: true },
    });

    // act
    // pass id like this again
    const requestId = testClient(idHandler, { id: post.id.toString() });
    // returns empty body for delete
    const { statusCode } = await requestId.delete(Routes.API.POSTS);

    const deletedPost = await prisma.post.findUnique({
      where: { id: post.id },
      include: { author: true },
    });

    // assert post was created in db
    expect(createdPost).toEqual(
      expect.objectContaining({
        title,
        content,
        author: expect.objectContaining({ id: author.id }),
      })
    );

    // assert only http code
    expect(statusCode).toBe(204);

    // assert post doesnt exist in db
    expect(deletedPost).toBeNull();

    // getMe called 2 times
    expect(mockedGetMeService).toHaveBeenCalled();
  });
});
