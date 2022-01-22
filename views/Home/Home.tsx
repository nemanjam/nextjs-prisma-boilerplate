import React from 'react';
import { withBem } from 'utils/bem';
import PostItem from 'components/PostItem';
import { usePosts } from 'lib-client/react-query/posts/usePosts';

const Home: React.FC = () => {
  const b = withBem('home');

  const { data: posts, isLoading } = usePosts();

  if (isLoading) return <h2>Loading...</h2>;

  return (
    <div className={b()}>
      <h1 className={b('title')}>Home</h1>
      <main className={b('list')}>
        {posts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </main>
    </div>
  );
};

export default Home;
