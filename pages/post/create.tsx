import React from 'react';
import Layout from 'components/Layout';
import { default as CreateView } from 'views/Create';

const Create: React.FC = () => {
  return (
    <Layout>
      <CreateView />
    </Layout>
  );
};

export default Create;
