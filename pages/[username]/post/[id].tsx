import React, { FC } from 'react';
import { GetServerSideProps } from 'next';
import PageLayout from 'layouts/PageLayout';
import PostView from 'views/Post';
import { dehydrate, QueryClient } from 'react-query';
import QueryKeys, { filterEmptyKeys } from 'lib-client/react-query/queryKeys';
import CustomHead from 'components/CustomHead';
import { ssrNcHandler } from 'lib-server/nc';
import { Redirects } from 'lib-client/constants';
import { PostWithAuthor } from 'types/models/Post';
import { getPost } from 'lib-server/services/posts';
import { validatePostIdNumber } from 'lib-server/validation';
import { ClientUser } from 'types/models/User';
import { getMe } from 'lib-server/services/users';

type Props = {
  title?: string;
  updatedAt?: string;
};

const Post: FC<Props> = ({ title, updatedAt }) => {
  // better pass as props than usePost, no loading state
  return (
    <>
      <CustomHead title={title} description={title} date={updatedAt} />
      <PageLayout>
        <PostView />
      </PageLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res, params }) => {
  const callback1 = async () => await getMe({ req });
  const me = await ssrNcHandler<ClientUser | null>(req, res, callback1);

  const callback2 = async () => {
    const id = validatePostIdNumber(params?.id as string);
    return await getPost(id);
  };
  const post = await ssrNcHandler<PostWithAuthor>(req, res, callback2);

  if (!post) return Redirects.NOT_FOUND;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([QueryKeys.POST, post.id], () => post);
  await queryClient.prefetchQuery(filterEmptyKeys([QueryKeys.ME, me?.id]), () => me);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      title: post.title,
      updatedAt: post.updatedAt.toISOString(),
    },
  };
};

export default Post;
