import { faker } from '@faker-js/faker';
import { Session } from 'next-auth';
import { ClientUser } from 'types';
import { Post } from '@prisma/client';
import { PaginatedResponse, PostWithAuthor } from 'types';
import { Blob } from 'buffer'; // node 16

const { lorem } = faker;
const numberOfPosts = 10;
const numberOfUsers = 4;

// almost same as seed, response types, not db
const createPosts = (n: number): Post[] => {
  return Array.from(Array(n).keys()).map((index) => ({
    id: index,
    title: lorem.sentence(),
    content: lorem.paragraphs(1),
    published: true,
    authorId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
};

// all posts by same author
const createPostsWithAuthor = (posts: Post[], author: ClientUser): PostWithAuthor[] => {
  return posts.map((post) => ({ ...post, authorId: author.id, author }));
};

const createUsers = (n: number): ClientUser[] => {
  return Array.from(Array(n).keys()).map((index) => ({
    id: faker.datatype.uuid(),
    name: `fakeuser${index} name`,
    username: `fakeuser${index}`,
    email: `fakeuser${index}@email.com`,
    image: index === 3 ? undefined : `avatar${index % 4}.jpg`, // 0...3
    headerImage: index === 3 ? undefined : `header${index % 4}.jpg`,
    // password,
    bio: lorem.sentences(3),
    // first user is admin
    role: index === 0 ? 'admin' : 'user',
    // additional
    createdAt: new Date(),
    updatedAt: new Date(),
    provider: 'credentials',
    emailVerified: null,
  }));
};

export const fakeUser: ClientUser = createUsers(1)[0];

export const fakeUsers: PaginatedResponse<ClientUser> = {
  items: createUsers(numberOfUsers),
  pagination: {
    total: numberOfUsers,
    pagesCount: 2,
    currentPage: 1,
    perPage: 3,
    from: 1,
    to: 3,
    hasMore: true,
  },
};

export const fakeSession: Session = {
  user: {
    id: fakeUser.id,
    email: fakeUser.email,
  },
  expires: new Date().toISOString(),
};

export const fakePosts: PaginatedResponse<PostWithAuthor> = {
  items: createPostsWithAuthor(createPosts(numberOfPosts), fakeUser),
  pagination: {
    total: 10,
    pagesCount: 2,
    currentPage: 1, // first page
    perPage: 5,
    from: 1,
    to: 5,
    hasMore: true,
  },
};

export const fakePost: Post = createPosts(1)[0];
export const fakePostWithAuthor: PostWithAuthor = createPostsWithAuthor(
  createPosts(1),
  fakeUser
)[0];

export const createFakeImageFile = ({
  name = 'image.jpg',
  size = 1024,
  type = 'image/jpeg',
  lastModified = new Date(),
} = {}): File => {
  const blob = new Blob(['a'.repeat(size)], { type });
  blob['lastModifiedDate'] = lastModified;
  blob['name'] = name;
  return blob as File;
  // return new File([blob as BlobPart], name);
};

// export const fakeImageFile = createFakeImageFile();

// return new File(['any text'], 'image.jpg', { type: 'image/jpg' });
