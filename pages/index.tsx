import React from 'react';
import { GetServerSideProps } from 'next';
import { dehydrate, QueryClient } from 'react-query';
import PageLayout from 'layouts/PageLayout';
import { getPostsWithAuthor } from 'pages/api/posts';
import HomeView from 'views/Home';
import QueryKeys from 'lib-client/react-query/queryKeys';

const Home: React.FC = () => {
  return (
    <PageLayout>
      {/* now posts are passed via context and React Query cache */}
      <HomeView />
    </PageLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(QueryKeys.POSTS, getPostsWithAuthor);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Home;
