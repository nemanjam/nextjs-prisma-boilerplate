import React, { FC } from 'react';
import { withBem } from 'utils/bem';

const Footer: FC = () => {
  const b = withBem('footer');

  return (
    <footer className={b()}>
      <p className={b('content')}>Footer 2022</p>
    </footer>
  );
};

export default Footer;
