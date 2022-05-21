import { faker } from '@faker-js/faker';
import { Session } from 'next-auth';
import { Post, User } from '@prisma/client';
import { ClientUser } from 'types/models/User';
import { PaginatedResponse } from 'types';
import { PostWithAuthor } from 'types/models/Post';
import { hashSync } from 'bcryptjs';

const { lorem } = faker;
const numberOfPosts = 10;
const numberOfUsers = 4;
const password = hashSync('123456', 10);

// ------------ User

function createUsers(n: number): ClientUser[];
function createUsers(n: number, isServer: true): User[];
function createUsers(n: number, isServer = false): User[] | ClientUser[] {
  const users = Array.from(Array(n).keys()).map((index) => {
    const user = {
      id: faker.datatype.uuid(),
      name: `user${index} name`,
      username: `user${index}`,
      email: `user${index}@email.com`,
      image: index === 3 ? undefined : `avatar${index % 4}.jpg`, // 0...3
      headerImage: index === 3 ? undefined : `header${index % 4}.jpg`,
      ...(isServer && { password }),
      bio: lorem.sentences(3),
      // first user is admin
      role: index === 0 ? 'admin' : 'user',
      // additional
      createdAt: new Date(),
      updatedAt: new Date(),
      provider: 'credentials',
      emailVerified: null,
    };
    return isServer ? (user as User) : (user as ClientUser);
  });
  return users;
}

export const fakeUser: ClientUser = createUsers(1)[0];
export const fakeServerUser: User = createUsers(1, true)[0];

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

// -------------- Session

export const fakeSession: Session = {
  user: {
    id: fakeUser.id,
    email: fakeUser.email,
  },
  expires: new Date().toISOString(),
};

// ------------- Post

// almost same as seed, response types, not db
const createPosts = (n: number): Post[] => {
  return Array.from(Array(n).keys()).map((index) => ({
    id: index,
    title: lorem.sentence(),
    content: lorem.paragraphs(1),
    published: true,
    authorId: fakeUser.id, // reassigned in createPostsWithAuthor()
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
};

// all posts by same author
const createPostsWithAuthor = (posts: Post[], author: ClientUser): PostWithAuthor[] => {
  return posts.map((post) => ({ ...post, authorId: author.id, author }));
};

// fakePostsWithAuthor
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
  fakeUser // logged in user must be used everywhere
)[0];

// unused
export const createFakeImageFile = ({
  name = 'image.jpg',
  size = 1024,
  type = 'image/jpeg',
  lastModified = new Date(),
} = {}): File => {
  const blob = new Blob(['a'.repeat(size)], { type }) as any;
  blob['lastModifiedDate'] = lastModified;
  blob['name'] = name;

  return blob as File;
};
