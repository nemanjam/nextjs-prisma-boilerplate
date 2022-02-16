import React, { FC } from 'react';
import { GetServerSideProps } from 'next';
import PageLayout from 'layouts/PageLayout';
import PostView from 'views/Post';
import { getPostWithAuthorById } from 'pages/api/posts/[id]';
import { dehydrate, QueryClient } from 'react-query';
import QueryKeys from 'lib-client/react-query/queryKeys';
import CustomHead from 'components/CustomHead';

type Props = {
  title?: string;
  updatedAt?: string;
};

const Post: FC<Props> = ({ title, updatedAt }) => {
  // can't read from cache onLoad
  return (
    <>
      <CustomHead title={title} description={title} date={updatedAt} />
      <PageLayout>
        <PostView />
      </PageLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = Number(params?.id);
  // try catch...
  const post = await getPostWithAuthorById(id);

  if (!post) {
    return {
      notFound: true,
    };
  }

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
