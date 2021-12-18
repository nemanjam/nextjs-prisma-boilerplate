import Router from 'next/router';
import axios from 'axios';
import { Routes } from 'lib-client/constants';

// PostWithAuthorStr+ in:
// pages/[username]/post/[id].tsx
// components/PostItem/PostItem.tsx
// PostWithAuthorStr[] in:
// home, drafts

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
