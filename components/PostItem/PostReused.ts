import Router from 'next/router';
import { Session } from 'next-auth';
import axios from 'axios';
import { Routes } from 'lib-client/constants';
import { PostWithAuthorStr } from 'types';

// pages/[username]/post/[id].tsx - page
// views/Post/Post.tsx - view
// components/PostItem/PostItem.tsx - component
export type PostProps = {
  post: PostWithAuthorStr;
};

// home, drafts - pages
export type PostsProps = {
  posts: PostWithAuthorStr[];
};

export const publishOrDeletePost = async (
  id: number,
  action: 'publish' | 'delete'
): Promise<void> => {
  try {
    switch (action) {
      case 'publish':
        await axios.patch(`${Routes.API.POSTS}${id}`, { published: true });
        break;
      case 'delete':
        await axios.delete(`${Routes.API.POSTS}${id}`);
        break;
    }
  } catch (error) {
    console.error(error);
  }
  await Router.push(Routes.SITE.HOME);
};

export const getIsPostOwner = (session: Session, post: PostWithAuthorStr) =>
  session && session.user?.id === post.author?.id;
export const getIsAdmin = (session: Session) => session?.user?.role === 'admin';
