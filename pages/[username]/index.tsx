import React from 'react';
import { GetServerSideProps } from 'next';
import Layout from 'components/Layout';
import prisma from 'lib-server/prisma';
import { default as PostComponent, PostWithAuthor } from 'components/Post';
import { UserStr, PostStr } from 'types/utils';
import { datesToStrings } from 'utils';

type ProfileProps = {
  profile: UserStr;
  posts: PostStr[];
};

const addAuthorToPosts = (user: UserStr, posts: PostStr[]): PostWithAuthor[] => {
  return posts.map((post) => ({ ...post, author: user }));
};

const Profile: React.FC<ProfileProps> = ({ profile, posts }) => {
  return (
    <Layout>
      <div className="page">
        <h1>Profile</h1>
        <pre>{JSON.stringify(profile, null, 2)}</pre>
        <main>
          {addAuthorToPosts(profile, posts).map((post) => (
            <div key={post.id} className="post">
              <PostComponent post={post} />
            </div>
          ))}
        </main>
      </div>

      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
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
