import React, { FC } from 'react';
import { GetServerSideProps } from 'next';
import { dehydrate, QueryClient } from 'react-query';
import PageLayout from 'layouts/PageLayout';
import HomeView from 'views/Home';
import QueryKeys from 'lib-client/react-query/queryKeys';
import CustomHead from 'components/CustomHead';
import { ssrNcHandler } from '@lib-server/nc';
import { PaginatedResponse } from 'types';
import { PostWithAuthor } from 'types/models/Post';
import { Redirects } from 'lib-client/constants';
import { getPosts } from '@lib-server/services/posts';
import { validatePostsSearchQueryParams } from '@lib-server/validation';

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
  // empty params, nothing to validate
  const callback = async () => await getPosts();
  const posts = ssrNcHandler<PaginatedResponse<PostWithAuthor>>(req, res, callback);

  if (!posts) return Redirects._500;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([QueryKeys.POSTS_HOME, 1], () => posts);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Home;
