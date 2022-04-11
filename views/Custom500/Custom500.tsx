import React, { FC } from 'react';
import Link from 'next/link';
import { BiErrorCircle } from 'react-icons/bi';
import { withBem } from 'utils/bem';

const Custom500: FC = () => {
  const b = withBem('custom-500');

  return (
    <div className={b()}>
      <div className={b('container')}>
        <h1>500 - Server-side error occurred</h1>
        <div className={b('content')}>
          <BiErrorCircle className={b('icon')} />
          <p>Internal Server Error.</p>
        </div>
        <Link href="/">
          <a className={b('home-link')}>Return Home</a>
        </Link>
      </div>
    </div>
  );
};

export default Custom500;
