import React from 'react';
import { GetServerSideProps } from 'next';
import PageLayout from 'layouts/PageLayout';
import { QueryClient } from 'react-query';
import ProfileView from 'views/Profile';
import { getUserByUsernameOrEmail } from 'pages/api/users';
import { getPostsWithAuthor } from 'pages/api/posts';
import { User } from '@prisma/client';
import QueryKeys from 'lib-client/react-query/queryKeys';

type ProfileProps = {
  profile: User;
};

const Profile: React.FC<ProfileProps> = ({ profile }) => {
  return (
    <PageLayout noPaddingTop>
      <ProfileView profile={profile} />
    </PageLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const _profile = await getUserByUsernameOrEmail(params);

  if (!_profile) {
    return {
      notFound: true,
    };
  }

  const { password, ...profile } = _profile;
  const query = { username: profile.username };

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(QueryKeys.POSTS, () => getPostsWithAuthor(query));

  return {
    props: {
      profile,
    },
  };
};

export default Profile;
