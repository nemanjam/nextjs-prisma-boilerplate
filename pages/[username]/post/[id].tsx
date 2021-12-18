import React from 'react';
import { GetServerSideProps } from 'next';
import Layout from 'components/Layout';
import { useSession } from 'next-auth/react';
import prisma from 'lib-server/prisma';
import { datesToStrings } from 'utils';
import { default as PostComponent } from 'views/Post';
import { PostWithAuthorStr } from 'types';

export type PostProps = {
  post: PostWithAuthorStr;
};

const Post: React.FC<PostProps> = ({ post }) => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  if (loading) {
    return <div>Authenticating ...</div>;
  }

  // in components or pages???
  const isOwner = session && session.user?.id === post.author?.id;
  const isAdmin = session?.user?.role === 'admin';

  return (
    <Layout>
      <PostComponent post={post} showPublishDeleteButtons={isOwner || isAdmin} />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: Number(params?.id) || -1,
    },
    include: {
      author: true,
    },
  });

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: { post: datesToStrings({ ...post, author: datesToStrings(post.author) }) },
  };
};

export default Post;
