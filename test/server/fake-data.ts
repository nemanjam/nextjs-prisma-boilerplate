import { Session } from 'next-auth';
import { ClientUser } from 'types';
import { PaginatedResponse, PostWithAuthor } from 'types';

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

export const fakeSession: Session = {
  user: {
    id: fakeUser.id,
    email: fakeUser.email,
  },
  expires: new Date().toISOString(),
};

export const fakePosts: PaginatedResponse<PostWithAuthor> = {
  items: [],
  pagination: {
    total: 24,
    pagesCount: 5,
    currentPage: 1,
    perPage: 5,
    from: 1,
    to: 5,
    hasMore: true,
  },
};
