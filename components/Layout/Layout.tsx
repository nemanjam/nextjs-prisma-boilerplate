import React, { ReactNode } from 'react';
import { withBem } from 'utils/bem';
import Navbar from 'components/Navbar';
import Footer from 'components/Footer';

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  const b = withBem('layout');

  return (
    <div className={b()}>
      <Navbar />
      <div className={b('content')}>{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
