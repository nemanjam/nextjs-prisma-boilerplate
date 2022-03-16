import { faker } from '@faker-js/faker';
import { Session } from 'next-auth';
import { ClientUser } from 'types';
import { Post } from '@prisma/client';
import { PaginatedResponse, PostWithAuthor } from 'types';

const { lorem } = faker;
const numberOfPosts = 10;

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
    role: index === 0 ? 'admin' : 'user',
    // additional
    createdAt: new Date(),
    updatedAt: new Date(),
    provider: 'credentials',
    emailVerified: null,
  }));
};

export const fakeUser = createUsers(1)[0];

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

/*
export const fakeUser: ClientUser = {
  id: 'ckzwmjsll00385wr0k2h1i8fl',
  name: 'user0 name',
  email: 'user0@email.com',
  username: 'user0',
  provider: 'credentials',
  emailVerified: null,
  image: 'avatar0.jpg',
  headerImage: 'header0.jpg',
  bio: 'Consequatur corporis ad quod blanditiis eaque. Quia non quam eos.',
  role: 'admin',
  createdAt: new Date(),
  updatedAt: new Date(),
};
*/
