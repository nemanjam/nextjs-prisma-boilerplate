import React from 'react';
import { GetServerSideProps } from 'next';
import { dehydrate, QueryClient } from 'react-query';
import PageLayout from 'layouts/PageLayout';
import { getUsers } from 'pages/api/users';
import UsersView from 'views/Users';
import QueryKeys from 'lib-client/react-query/queryKeys';

const Users: React.FC = () => {
  return (
    <PageLayout>
      <UsersView />
    </PageLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([QueryKeys.USERS, 1], () => getUsers(query));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Users;
