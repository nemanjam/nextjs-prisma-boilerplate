import React, { FC } from 'react';
import { GetServerSideProps } from 'next';
import PageLayout from 'layouts/PageLayout';
import { getSession } from 'next-auth/react';
import { dehydrate, QueryClient } from 'react-query';
import DraftsView from 'views/Drafts';
import QueryKeys from 'lib-client/react-query/queryKeys';
import { getPostsWithAuthor } from 'pages/api/posts';
import { useMe } from 'lib-client/react-query/auth/useMe';
import { redirectLogin } from 'utils';

const Drafts: FC = () => {
  const { me } = useMe();

  if (!me) {
    return (
      <PageLayout>
        <h1>My Drafts</h1>
        <div>You need to be authenticated to view this page.</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <DraftsView />
    </PageLayout>
  );
};

// can have pagination
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  const id = session?.user?.id;

  if (!id) {
    return redirectLogin;
  }

  const query = {
    userId: id,
    published: 'false', // query string
  };

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([QueryKeys.POSTS_DRAFTS, 1], () =>
    getPostsWithAuthor(query)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Drafts;
