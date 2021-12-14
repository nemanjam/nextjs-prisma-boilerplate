import React, { ReactNode } from 'react';
import Header from 'components/Header';
import { withBem } from 'utils/bem';

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  const b = withBem('layout');

  return (
    <div className={b()}>
      <Header />
      <div className={b('content')}>{children}</div>
    </div>
  );
};

export default Layout;
