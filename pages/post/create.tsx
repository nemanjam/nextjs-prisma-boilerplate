import React from 'react';
import PageLayout from 'layouts/PageLayout';
import { default as CreateView } from 'views/Create';

const Create: React.FC = () => {
  return (
    <PageLayout>
      <CreateView />
    </PageLayout>
  );
};

export default Create;
