import React, { ReactNode } from 'react';
import Header from 'components/Header';
import styles from 'components/Layout/Layout.module.scss';

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => (
  <div>
    <Header />
    <div>{children}</div>
  </div>
);

export default Layout;
