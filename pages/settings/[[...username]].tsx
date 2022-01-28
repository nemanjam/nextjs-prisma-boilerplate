import { FC } from 'react';
import { GetServerSideProps } from 'next';
import { dehydrate, QueryClient } from 'react-query';
import { Routes } from 'lib-client/constants';
import PageLayout from 'layouts/PageLayout';
import SettingsView from 'views/Settings';
import QueryKeys from 'lib-client/react-query/queryKeys';
import {
  getUserByIdOrUsernameOrEmail,
  GetUserQueryParams,
} from 'pages/api/users/profile';
import { getMe } from '@lib-server/prisma';

const Settings: FC = () => {
  return (
    <PageLayout>
      <SettingsView />
    </PageLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
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
  // if my username trim url

  let _params: GetUserQueryParams = {};
  if (params?.username) {
    if (me.role === 'admin') {
      _params = { username: params?.username[0] };
    } else {
      return notFound;
    }
  } else {
    _params = { id: me.id };
  }

  const user = await getUserByIdOrUsernameOrEmail(_params);

  if (!user) {
    return notFound;
  }

  const subKey = _params?.username || _params?.id;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([QueryKeys.USER, subKey], () => user);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Settings;
