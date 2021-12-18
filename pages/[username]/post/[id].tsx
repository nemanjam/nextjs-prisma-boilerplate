import React from 'react';
import { GetServerSideProps } from 'next';
import Layout from 'components/Layout';
import { useSession } from 'next-auth/react';
import prisma from 'lib-server/prisma';
import { datesToStrings } from 'utils';
import { PostWithAuthorStr } from 'types';
import { default as PostComponent } from 'views/Post';

type PostProps = {
  post: PostWithAuthorStr;
};

const Post: React.FC<PostProps> = ({ post }) => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  if (loading) {
    return <div>Authenticating ...</div>;
  }

  const isOwner = session && session.user?.id === post.author?.id;
  const isOwnerOrAdmin = isOwner || session?.user?.role === 'admin';

  return (
    <Layout>
      <PostComponent post={post} isOwner={isOwnerOrAdmin} />
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
