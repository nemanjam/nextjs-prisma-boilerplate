import { testClient } from 'test-server/test-client';
import indexHandler from 'pages/api/posts';
import idHandler from 'pages/api/posts/[id]';
import { Routes } from 'lib-client/constants';
import { fakePostWithAuthor, fakeUsers } from 'test-client/server/fake-data';
import { PostCreateData, PostUpdateData } from 'types/models/Post';
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
    const request = testClient(indexHandler);
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

  test('non-owner and non-admin cannot update a post', async () => {
    const updatedTitle = 'updated-title';
    // different id, role=user
    const otherUser = fakeUsers.items[1];

    // mock service output
    const mockedUpdatePostService = jest
      .spyOn(postsService, 'updatePost')
      .mockResolvedValueOnce(fakePostWithAuthor);

    // prepare controller args
    const { id } = fakePostWithAuthor;
    const postUpdateData: PostUpdateData = { title: updatedTitle };

    // mock getMe service, put different user in session
    const mockedGetMeService = jest
      .spyOn(usersService, 'getMe')
      .mockResolvedValue(otherUser);

    // mock getPost that post exists
    const mockedGetPostService = jest
      .spyOn(postsService, 'getPost')
      .mockResolvedValueOnce(fakePostWithAuthor);

    // act
    const request = testClient(idHandler, { id }); // /api/posts/:id must be passed like this
    const { statusCode, body } = await request
      .patch(Routes.API.POSTS)
      .send(postUpdateData);

    // assert http response
    expect(statusCode).toBe(400);
    expect(body).toEqual(expect.objectContaining({ id: 1 }));

    // assert sevice input args
    expect(mockedUpdatePostService).not.toHaveBeenCalled();

    // assert getMe and getPost are called
    expect(mockedGetMeService).toHaveBeenCalled();
    expect(mockedGetPostService).toHaveBeenCalled();

    // clean up mocks
    mockedUpdatePostService.mockRestore();
    mockedGetMeService.mockRestore();
    mockedGetPostService.mockRestore();
  });
});
