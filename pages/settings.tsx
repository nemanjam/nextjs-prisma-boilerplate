import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import prisma from 'lib-server/prisma';
import { Routes } from 'lib-client/constants';
import { datesToStrings } from 'utils';
import Layout from 'components/Layout';
import { UserStr } from 'types';
import { default as SettingsView } from 'views/Settings';

type Props = {
  user: UserStr;
};

const Settings: React.FC<Props> = ({ user }) => {
  return (
    <Layout>
      <SettingsView user={user} />
    </Layout>
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

  if (!session) {
    return redirect;
  }

  // not all user fields are available in session.user
  const user = await prisma.user.findUnique({
    where: { username: session.user.username },
  });

  if (!user) {
    return redirect;
  }

  return {
    props: {
      user: datesToStrings(user),
    },
  };
};

export default Settings;
