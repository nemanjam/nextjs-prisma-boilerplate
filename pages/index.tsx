import React from 'react';
import { GetServerSideProps } from 'next';
import PageLayout from 'layouts/PageLayout';
import { PostsProps } from 'components/PostItem';
import { getPostsWithAuthor } from 'pages/api/posts';
import { datesToStrings } from 'utils';
import HomeView from 'views/Home';

const Home: React.FC<PostsProps> = ({ posts }) => {
  return (
    <PageLayout>
      <HomeView posts={posts} />
    </PageLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const _posts = await getPostsWithAuthor();

  const posts = _posts.map(({ author, ...post }) =>
    datesToStrings({ ...post, author: datesToStrings(author) })
  );

  return {
    props: {
      posts,
    },
  };
};

export default Home;
