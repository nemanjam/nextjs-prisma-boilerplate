import React, { FC, ReactNode } from 'react';
import { withBem } from 'utils/bem';
import Navbar from 'components/Navbar';
import Footer from 'components/Footer';

type Props = {
  children: ReactNode;
  noPaddingTop?: boolean;
};

const PageLayout: FC<Props> = ({ children, noPaddingTop }) => {
  const b = withBem('page-layout');

  return (
    <div className={b()}>
      <Navbar />
      <main className={b('content', { 'no-padding-top': noPaddingTop })}>{children}</main>
      <Footer />
    </div>
  );
};

export default PageLayout;
