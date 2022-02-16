import React, { FC } from 'react';
import { GetServerSideProps } from 'next';
import { dehydrate, QueryClient } from 'react-query';
import PageLayout from 'layouts/PageLayout';
import { getUsers } from 'pages/api/users';
import UsersView from 'views/Users';
import QueryKeys from 'lib-client/react-query/queryKeys';
import CustomHead from 'components/CustomHead';

const Users: FC = () => {
  return (
    <>
      <CustomHead />
      <PageLayout>
        <UsersView />
      </PageLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([QueryKeys.USERS, 1], () => getUsers({})); // use api defaults

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Users;
