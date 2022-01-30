import React, { FC } from 'react';
import { GetServerSideProps } from 'next';
import { dehydrate, QueryClient } from 'react-query';
import CreateView from 'views/Create';
import PageLayout from 'layouts/PageLayout';
import { getMe } from '@lib-server/prisma';
import { Routes } from 'lib-client/constants';
import { getPostWithAuthorById } from 'pages/api/posts/[id]';
import QueryKeys from 'lib-client/react-query/queryKeys';

const Create: FC = () => {
  return (
    <PageLayout>
      <CreateView />
    </PageLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
  // if no param in url - no preloading logic needed
  if (!params?.id?.[0])
    return {
      props: {},
    };

  const me = await getMe({ req });

  const notFound = {
    notFound: true,
  } as const;

  const redirect = {
    redirect: {
      permanent: false,
      destination: Routes.SITE.LOGIN,
    },
  };

  if (!me) {
    return redirect;
  }

  const id = Number(params.id[0]);
  const post = await getPostWithAuthorById(id);

  if (!post) {
    return notFound;
  }

  if (!(post.author.id === me.id || me.role === 'admin')) {
    return notFound;
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
