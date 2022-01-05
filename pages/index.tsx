import React from 'react';
import { GetServerSideProps } from 'next';
import PageLayout from 'layouts/PageLayout';
import { PostsProps } from 'components/PostItem';
import prisma from 'lib-server/prisma';
import { datesToStrings } from 'utils';
import { default as HomeView } from 'views/Home';

const Home: React.FC<PostsProps> = ({ posts }) => {
  return (
    <PageLayout>
      <HomeView posts={posts} />
    </PageLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  let _posts = await prisma.post.findMany({
    where: {
      published: true,
    },
    include: {
      author: true,
    },
  });

  _posts = _posts?.length > 0 ? _posts : [];

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
