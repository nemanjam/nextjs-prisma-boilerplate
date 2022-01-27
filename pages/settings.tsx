import { FC } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { dehydrate, QueryClient } from 'react-query';
import { Routes } from 'lib-client/constants';
import PageLayout from 'layouts/PageLayout';
import SettingsView from 'views/Settings';
import { getUserById } from './api/users/[id]';
import QueryKeys from 'lib-client/react-query/queryKeys';

const Settings: FC = () => {
  return (
    <PageLayout>
      <SettingsView />
    </PageLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  const redirect = {
    redirect: {
      permanent: false,
      destination: Routes.SITE.LOGIN,
    },
  };

  if (!session?.user) {
    return redirect;
  }

  const user = await getUserById(session.user.id);

  if (!user) {
    return {
      notFound: true,
    };
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([QueryKeys.USER, user.id], () => user);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Settings;
