import React, { FC } from 'react';
import { GetServerSideProps } from 'next';
import { dehydrate, QueryClient } from 'react-query';
import PageLayout from 'layouts/PageLayout';
import { getPostsWithAuthor } from 'pages/api/posts';
import HomeView from 'views/Home';
import QueryKeys from 'lib-client/react-query/queryKeys';
import CustomHead from 'components/CustomHead';
import { ssrNcHandler } from '@lib-server/nc';
import { PaginatedResponse, PostWithAuthor } from 'types';
import { redirect500 } from 'utils';

const Home: FC = () => {
  return (
    <>
      <CustomHead />
      <PageLayout>
        {/* now posts are passed via context and React Query cache */}
        <HomeView />
      </PageLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const callback = async () => await getPostsWithAuthor({});
  const posts = ssrNcHandler<PaginatedResponse<PostWithAuthor>>(req, res, callback);

  if (!posts) return redirect500;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([QueryKeys.POSTS_HOME, 1], () => posts);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Home;
