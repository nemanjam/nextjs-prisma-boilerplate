import React, { FC } from 'react';
import PageLayout from 'layouts/PageLayout';
import { default as CreateView } from 'views/Create';

const Create: FC = () => {
  return (
    <PageLayout>
      <CreateView />
    </PageLayout>
  );
};

export default Create;
