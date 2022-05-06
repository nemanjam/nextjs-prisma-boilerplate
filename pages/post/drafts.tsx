import React, { FC } from 'react';
import { GetServerSideProps } from 'next';
import PageLayout from 'layouts/PageLayout';
import { dehydrate, QueryClient } from 'react-query';
import DraftsView from 'views/Drafts';
import QueryKeys from 'lib-client/react-query/queryKeys';
import { Redirects } from 'lib-client/constants';
import CustomHead from 'components/CustomHead';
import { ssrNcHandler } from 'lib-server/nc';
import { PaginatedResponse, QueryParamsType } from 'types';
import { PostWithAuthor } from 'types/models/Post';
import { getPosts } from 'lib-server/services/posts';
import { validatePostsSearchQueryParams } from 'lib-server/validation';
import { ClientUser } from 'types/models/User';
import { getMe } from 'lib-server/services/users';

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
  // id is enough, but get me for MeProvider
  const callback1 = async () => await getMe({ req });
  const me = await ssrNcHandler<ClientUser | null>(req, res, callback1);

  if (!me) return Redirects.LOGIN;

  const query: QueryParamsType = {
    userId: me.id,
    published: 'false', // must be string
  };

  const callback2 = async () => {
    const parsedData = validatePostsSearchQueryParams(query);
    return await getPosts(parsedData);
  };
  const posts = await ssrNcHandler<PaginatedResponse<PostWithAuthor>>(
    req,
    res,
    callback2
  );

  if (!posts) return Redirects._500;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([QueryKeys.POSTS_DRAFTS, 1], () => posts);
  await queryClient.prefetchQuery([QueryKeys.ME, me.id], () => me);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Drafts;
