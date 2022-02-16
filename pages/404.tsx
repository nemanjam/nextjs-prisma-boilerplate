import { FC } from 'react';
import NotFound from 'views/NotFound';
import CustomHead from 'components/CustomHead';

const Page404: FC = () => {
  return (
    <>
      <CustomHead />
      <NotFound />
    </>
  );
};

export default Page404;
