import React, { FC } from 'react';
import { GetServerSideProps } from 'next';
import PageLayout from 'layouts/PageLayout';
import { getSession } from 'next-auth/react';
import { dehydrate, QueryClient } from 'react-query';
import DraftsView from 'views/Drafts';
import QueryKeys from 'lib-client/react-query/queryKeys';
import { getPostsWithAuthor } from 'pages/api/posts';
import { Redirects } from 'lib-client/constants';
import CustomHead from 'components/CustomHead';
import { ssrNcHandler } from '@lib-server/nc';
import { PaginatedResponse, PostWithAuthor } from 'types/models/response';

const Drafts: FC = () => {
  return (
    <>
      <CustomHead title="Draft posts" description="Draft posts" />
      <PageLayout>
        <DraftsView />
      </PageLayout>
    </>
  );
};

// can have pagination
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  // id is enough
  const session = await getSession({ req });
  const id = session?.user?.id;

  if (!id) return Redirects.LOGIN;

  const query = {
    userId: id,
    published: 'false', // query string
  };

  const callback = async () => await getPostsWithAuthor(query);
  const posts = await ssrNcHandler<PaginatedResponse<PostWithAuthor>>(req, res, callback);

  if (!posts) return Redirects._500;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([QueryKeys.POSTS_DRAFTS, 1], () => posts);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Drafts;
