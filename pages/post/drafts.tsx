import React from 'react';
import { GetServerSideProps } from 'next';
import PageLayout from 'layouts/PageLayout';
import { useSession, getSession } from 'next-auth/react';
import prisma from 'lib-server/prisma';
import { datesToStrings } from 'utils';
import { default as DraftsView } from 'views/Drafts';
import { PostsProps } from 'components/PostItem';
import { dehydrate, QueryClient } from 'react-query';
import QueryKeys from 'lib-client/react-query/queryKeys';
import { getPostsWithAuthor } from 'pages/api/posts';

const Drafts: React.FC<PostsProps> = ({ posts }) => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <PageLayout>
        <h1>My Drafts</h1>
        <div>You need to be authenticated to view this page.</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <DraftsView posts={posts} />
    </PageLayout>
  );
};

// can have pagination
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });

  if (!session) {
    res.statusCode = 403;
    return { props: { posts: [] } };
  }

  const query = {
    userId: session.user.id,
    published: 'false', // query string
  };

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(QueryKeys.POSTS_DRAFTS, () =>
    getPostsWithAuthor(query)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Drafts;
