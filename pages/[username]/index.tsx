import React from 'react';
import { GetServerSideProps } from 'next';
import prisma from 'lib-server/prisma';
import Layout from 'components/Layout';
import { UserStr, PostStr } from 'types';
import { datesToStrings } from 'utils';
import { default as ProfileView } from 'views/Profile';

type ProfileProps = {
  profile: UserStr;
  posts: PostStr[];
};

const Profile: React.FC<ProfileProps> = ({ profile, posts }) => {
  return (
    <Layout>
      <ProfileView profile={profile} posts={posts} />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  // validate first
  const user = await prisma.user.findUnique({
    where: {
      username: params?.username as string,
    },
    include: {
      posts: {
        where: {
          published: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      },
    },
  });

  if (!user) {
    return {
      notFound: true,
    };
  }

  const { posts, password, ...profile } = user;

  return {
    props: {
      profile: datesToStrings(profile),
      posts: posts.map((post) => datesToStrings(post)),
    },
  };
};

export default Profile;
