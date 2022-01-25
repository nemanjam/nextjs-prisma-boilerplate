import { Session } from 'next-auth';
import { PostWithAuthorStr, PostWithAuthor } from 'types';

// pages/[username]/post/[id].tsx - page
// views/Post/Post.tsx - view
// components/PostItem/PostItem.tsx - component
export type PostProps = {
  post: PostWithAuthor;
};

// home, drafts - pages
export type PostsProps = {
  posts: PostWithAuthorStr[];
};

export const getIsPostOwner = (session: Session, post: PostWithAuthor) =>
  session && session.user?.id === post.author?.id;
export const getIsAdmin = (session: Session) => session?.user?.role === 'admin';
