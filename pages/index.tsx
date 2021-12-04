import React from 'react';
import { GetStaticProps } from 'next';
import Layout from 'components/Layout';
import Post, { PostWithAuthor } from 'components/Post';
import prisma from 'lib-server/prisma';
import { datesToStrings } from 'utils';

type HomeProps = {
  posts: PostWithAuthor[];
};

const Home: React.FC<HomeProps> = ({ posts }) => {
  return (
    <Layout>
      <div className="page">
        <h1>Public Feed</h1>
        <main>
          {posts.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
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

export const getStaticProps: GetStaticProps = async () => {
  let _posts = await prisma.post.findMany({
    where: {
      published: true,
    },
    include: {
      author: true,
    },
  });

  _posts = _posts?.length > 0 ? _posts : [];

  const posts = _posts.map(({ author, ...post }) =>
    datesToStrings({ ...post, author: datesToStrings(author) })
  );

  return {
    props: {
      posts,
    },
  };
};

export default Home;
