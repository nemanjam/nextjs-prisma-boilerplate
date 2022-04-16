import React, { FC } from 'react';
import { GetServerSideProps } from 'next';
import PageLayout from 'layouts/PageLayout';
import PostView from 'views/Post';
import { getPostWithAuthorById } from 'pages/api/posts/[id]';
import { dehydrate, QueryClient } from 'react-query';
import QueryKeys from 'lib-client/react-query/queryKeys';
import CustomHead from 'components/CustomHead';
import { ssrNcHandler } from '@lib-server/nc';
import { Redirects } from 'lib-client/constants';
import { PostWithAuthor } from 'types/models/response';

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
  const id = Number(params?.id);

  const callback = async () => await getPostWithAuthorById(id);
  const post = await ssrNcHandler<PostWithAuthor>(req, res, callback);

  if (!post) return Redirects.NOT_FOUND;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([QueryKeys.POST, id], () => post);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      title: post.title,
      updatedAt: post.updatedAt.toISOString(),
    },
  };
};

export default Post;
