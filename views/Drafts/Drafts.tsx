import React from 'react';
import { PostWithAuthorStr } from 'types';
import { withBem } from 'utils/bem';
import PostItem from 'components/PostItem';

type DraftsProps = {
  posts: PostWithAuthorStr[];
};

const Drafts: React.FC<DraftsProps> = ({ posts }) => {
  const b = withBem('drafts');

  return (
    <div className={b()}>
      <h1 className={b('title')}>My Drafts</h1>
      <main className={b('list')}>
        {posts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </main>
    </div>
  );
};

export default Drafts;
