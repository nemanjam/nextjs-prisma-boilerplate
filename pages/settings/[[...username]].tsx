import { FC } from 'react';
import { GetServerSideProps } from 'next';
import { dehydrate, QueryClient } from 'react-query';
import PageLayout from 'layouts/PageLayout';
import SettingsView from 'views/Settings';
import QueryKeys from 'lib-client/react-query/queryKeys';
import {
  getUserByIdOrUsernameOrEmail,
  GetUserQueryParams,
} from 'pages/api/users/profile';
import { getMe } from '@lib-server/prisma';
import { redirectLogin, redirectNotFound } from 'utils';
import CustomHead from 'components/CustomHead';

const Settings: FC = () => {
  return (
    <>
      <CustomHead title="Settings" description="Settings" />
      <PageLayout>
        <SettingsView />
      </PageLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
  const me = await getMe({ req });

  if (!me) {
    return redirectLogin;
  }
  // if my username trim url

  let _params: GetUserQueryParams = {};
  if (params?.username) {
    if (me.role === 'admin') {
      _params = { username: params?.username[0] };
    } else {
      return redirectNotFound;
    }
  } else {
    _params = { id: me.id };
  }

  const user = await getUserByIdOrUsernameOrEmail(_params);

  if (!user) {
    return redirectNotFound;
  }

  const subKey = _params?.username || _params?.id;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([QueryKeys.USER, subKey], () => user);
  await queryClient.prefetchQuery(QueryKeys.ME, () => me);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Settings;
