import React, { FC } from 'react';
import Link from 'next/link';
import { FaCat } from 'react-icons/fa';
import { withBem } from 'utils/bem';

const NotFound: FC = () => {
  const b = withBem('not-found');

  return (
    <div className={b()}>
      <div className={b('container')}>
        <h1>Page not found 404</h1>
        <div className={b('content')}>
          <FaCat className={b('icon')} />
          <p>Page you are looking for does not exist.</p>
        </div>
        <Link href="/">
          <a className={b('home-link')}>Return Home</a>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
