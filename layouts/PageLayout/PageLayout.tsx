import React, { ReactNode } from 'react';
import { withBem } from 'utils/bem';
import Navbar from 'components/Navbar';
import Footer from 'components/Footer';

type Props = {
  children: ReactNode;
};

const PageLayout: React.FC<Props> = ({ children }) => {
  const b = withBem('page-layout');

  return (
    <div className={b()}>
      <Navbar />
      <main className={b('content')}>{children}</main>
      <Footer />
    </div>
  );
};

export default PageLayout;
