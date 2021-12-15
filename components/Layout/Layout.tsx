import React, { ReactNode } from 'react';
import Navbar from 'components/Navbar';
import { withBem } from 'utils/bem';

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  const b = withBem('layout');

  return (
    <div className={b()}>
      <Navbar />
      <div className={b('content')}>{children}</div>
    </div>
  );
};

export default Layout;
