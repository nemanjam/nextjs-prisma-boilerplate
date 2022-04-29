import React, { FC } from 'react';
import { GetServerSideProps } from 'next';
import { dehydrate, QueryClient } from 'react-query';
import PageLayout from 'layouts/PageLayout';
import UsersView from 'views/Users';
import QueryKeys, { filterEmptyKeys } from 'lib-client/react-query/queryKeys';
import CustomHead from 'components/CustomHead';
import { ssrNcHandler } from 'lib-server/nc';
import { ClientUser } from 'types/models/User';
import { PaginatedResponse } from 'types';
import { Redirects } from 'lib-client/constants';
import { getMe, getUsers } from 'lib-server/services/users';

const Users: FC = () => {
  return (
    <>
      <CustomHead title="Users page" description="Users page" />
      <PageLayout>
        <UsersView />
      </PageLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  // just for MeProvider
  const callback1 = async () => await getMe({ req });
  const me = await ssrNcHandler<ClientUser>(req, res, callback1);

  const callback2 = async () => await getUsers(); // use api defaults
  const users = await ssrNcHandler<PaginatedResponse<ClientUser>>(req, res, callback2);

  if (!users) return Redirects._500;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([QueryKeys.USERS, 1], () => users);
  await queryClient.prefetchQuery(filterEmptyKeys([QueryKeys.ME, me?.id]), () => me);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Users;
