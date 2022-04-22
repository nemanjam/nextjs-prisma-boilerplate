import { ClientUser } from 'types/models/User';
import { PostWithAuthor } from 'types/models/Post';

export const getIsPostOwner = (user: ClientUser, post: PostWithAuthor) =>
  user?.id === post.author?.id;

export const getIsAdmin = (user: ClientUser) => user?.role === 'admin';
