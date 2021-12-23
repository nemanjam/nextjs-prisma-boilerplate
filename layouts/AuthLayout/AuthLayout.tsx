import React, { ReactNode } from 'react';
import { withBem } from 'utils/bem';

type Props = {
  children: ReactNode;
};

const AuthLayout: React.FC<Props> = ({ children }) => {
  const b = withBem('auth-layout');

  return (
    <div className={b()}>
      <main className={b('content')}>{children}</main>
    </div>
  );
};

export default AuthLayout;
