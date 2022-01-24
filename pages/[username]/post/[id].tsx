import React, { FC } from 'react';
import { GetServerSideProps } from 'next';
import PageLayout from 'layouts/PageLayout';
import { useSession } from 'next-auth/react';
import PostView from 'views/Post';
import { PostProps } from 'components/PostItem';
import { getPostWithAuthorById } from 'pages/api/posts/[id]';

const Post: FC<PostProps> = ({ post }) => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  if (loading) {
    return <div>Authenticating ...</div>;
  }

  return (
    <PageLayout>
      <PostView post={post} />
    </PageLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  // try catch...
  const post = await getPostWithAuthorById(Number(params?.id));

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: { post },
  };
};

export default Post;
