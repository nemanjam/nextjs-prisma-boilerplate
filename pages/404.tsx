import { FC } from 'react';
import Head from 'next/head';
import NotFound from 'views/NotFound';

const Page404: FC = () => {
  return (
    <>
      <Head>
        <title>Not Found</title>
      </Head>
      <NotFound />
    </>
  );
};

export default Page404;
