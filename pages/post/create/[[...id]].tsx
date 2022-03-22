import React, { FC } from 'react';
import { GetServerSideProps } from 'next';
import { dehydrate, QueryClient } from 'react-query';
import CreateView from 'views/Create';
import PageLayout from 'layouts/PageLayout';
import { getMe } from 'lib-server/prisma';
import { getPostWithAuthorById } from 'pages/api/posts/[id]';
import QueryKeys from 'lib-client/react-query/queryKeys';
import { redirectLogin, redirectNotFound } from 'utils';
import CustomHead from 'components/CustomHead';

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

export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
  const me = await getMe({ req });

  if (!me) {
    return redirectLogin;
  }

  const id = Number(params?.id?.[0]);

  // if no param in url - no preloading logic needed
  if (!id)
    return {
      props: {},
    };

  const post = await getPostWithAuthorById(id);

  if (!post) {
    return redirectNotFound;
  }

  if (!(post.author.id === me.id || me.role === 'admin')) {
    return redirectNotFound;
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
