import { testClient, teardown } from 'test-server/test-client';
import indexHandler from 'pages/api/posts';
import idHandler from 'pages/api/posts/[id]';
import { Routes } from 'lib-client/constants';
import { fakePostWithAuthor, fakeUsers } from 'test-client/server/fake-data';
import { PostCreateData, PostUpdateData } from 'types/models/Post';

describe('Posts', () => {
  afterAll(async () => {
    await teardown();
  });

  test('create new post success', async () => {
    // prepare controller args
    const { author: user, title, content } = fakePostWithAuthor;
    const postData: PostCreateData = { title, content };

    // todo: needs logged in user in beforeAll

    // act
    const request = testClient(indexHandler);
    const { statusCode, body } = await request.post(Routes.API.POSTS).send(postData);

    // query db

    // assert http response
    expect(statusCode).toBe(201);
    // match part of the object, ignore Date()
    expect(body).toEqual(
      expect.objectContaining({
        id: fakePostWithAuthor.id,
        title: fakePostWithAuthor.title,
        content: fakePostWithAuthor.content,
      })
    );
  });
});
