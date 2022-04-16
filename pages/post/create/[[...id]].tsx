import React, { FC } from 'react';
import { GetServerSideProps } from 'next';
import { dehydrate, QueryClient } from 'react-query';
import CreateView from 'views/Create';
import PageLayout from 'layouts/PageLayout';
import { getMe } from 'lib-server/prisma';
import { getPostWithAuthorById } from 'pages/api/posts/[id]';
import QueryKeys from 'lib-client/react-query/queryKeys';
import { Redirects } from 'lib-client/constants';
import CustomHead from 'components/CustomHead';
import { ssrNcHandler } from '@lib-server/nc';
import { ClientUser } from 'types/models/User';
import { PostWithAuthor } from 'types/models/Post';

const Create: FC = () => {
  return (
    <>
      <CustomHead title="Create or update post" description="Create or update post" />
      <PageLayout>
        <CreateView />
      </PageLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params, req, res }) => {
  const callback1 = async () => await getMe({ req });
  const me = await ssrNcHandler<ClientUser>(req, res, callback1);

  if (!me) return Redirects.LOGIN;

  const id = Number(params?.id?.[0]);

  // if no param in url - no preloading logic needed
  if (!id)
    return {
      props: {},
    };

  const callback2 = async () => await getPostWithAuthorById(id);
  const post = await ssrNcHandler<PostWithAuthor>(req, res, callback2);

  if (!post) return Redirects.NOT_FOUND;

  if (!(post.author.id === me.id || me.role === 'admin')) {
    return Redirects.NOT_FOUND;
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([QueryKeys.POST, post.id], () => post);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Create;
