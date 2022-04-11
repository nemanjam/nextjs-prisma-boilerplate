import { FC } from 'react';
import Custom500 from 'views/Custom500';
import CustomHead from 'components/CustomHead';

const Page500: FC = () => {
  return (
    <>
      <CustomHead title="Server Error" description="Server Error" />
      <Custom500 />
    </>
  );
};

export default Page500;
