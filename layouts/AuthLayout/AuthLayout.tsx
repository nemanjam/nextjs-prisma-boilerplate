import React, { FC, ReactNode } from 'react';
import { withBem } from 'utils/bem';

type Props = {
  children: ReactNode;
};

const AuthLayout: FC<Props> = ({ children }) => {
  const b = withBem('auth-layout');

  return (
    <div className={b()}>
      <main className={b('content')}>{children}</main>
    </div>
  );
};

export default AuthLayout;
