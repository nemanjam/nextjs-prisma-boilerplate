import React, { FC } from 'react';
import { GetServerSideProps } from 'next';
import { dehydrate, QueryClient } from 'react-query';
import PageLayout from 'layouts/PageLayout';
import HomeView from 'views/Home';
import QueryKeys, { filterEmptyKeys } from 'lib-client/react-query/queryKeys';
import CustomHead from 'components/CustomHead';
import { ssrNcHandler } from 'lib-server/nc';
import { PaginatedResponse } from 'types';
import { PostWithAuthor } from 'types/models/Post';
import { Redirects } from 'lib-client/constants';
import { getPosts } from 'lib-server/services/posts';
import { ClientUser } from 'types/models/User';
import { getMe } from 'lib-server/services/users';

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
  // just for MeProvider
  const callback1 = async () => await getMe({ req });
  const me = await ssrNcHandler<ClientUser>(req, res, callback1);

  // empty params, nothing to validate
  const callback = async () => await getPosts();
  const posts = ssrNcHandler<PaginatedResponse<PostWithAuthor>>(req, res, callback);

  if (!posts) return Redirects._500;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([QueryKeys.POSTS_HOME, 1], () => posts);
  await queryClient.prefetchQuery(filterEmptyKeys([QueryKeys.ME, me?.id]), () => me);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Home;
