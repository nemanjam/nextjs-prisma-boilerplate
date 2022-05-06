import { testClient } from 'test-server/test-client';
import handler from 'pages/api/posts';
import { Routes } from 'lib-client/constants';
import { fakePostWithAuthor } from 'test-client/server/fake-data';
import { PostCreateData } from 'types/models/Post';
import * as postsService from 'lib-server/services/posts';
import * as usersService from 'lib-server/services/users';

describe('Posts controller', () => {
  test('create new post success', async () => {
    // mock service output
    const mockedCreatePostService = jest
      .spyOn(postsService, 'createPost')
      .mockResolvedValueOnce(fakePostWithAuthor);

    // prepare controller args
    const { author: user, title, content } = fakePostWithAuthor;
    const postData: PostCreateData = { title, content };

    // mock getMe service, called 2 times
    const mockedGetMeService = jest.spyOn(usersService, 'getMe').mockResolvedValue(user);

    // act
    const request = testClient(handler);
    const { statusCode, body } = await request.post(Routes.API.POSTS).send(postData);

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

    // assert sevice input args
    expect(mockedCreatePostService).toHaveBeenCalledWith(user.id, postData);

    // getMe called 2 times
    expect(mockedGetMeService).toHaveBeenCalled();

    // clean up mocks
    mockedCreatePostService.mockRestore();
    mockedGetMeService.mockRestore();
  });
});
