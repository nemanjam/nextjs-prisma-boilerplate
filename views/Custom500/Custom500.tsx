import React, { FC } from 'react';
import Link from 'next/link';
import { BiErrorCircle } from 'react-icons/bi';
import { withBem } from 'utils/bem';
import ErrorCard from 'components/Error/ErrorCard';

const Custom500: FC = () => {
  const b = withBem('custom-500');

  return (
    <div className={b()}>
      <ErrorCard
        title="500 - Server-side error occurred"
        icon={<BiErrorCircle />}
        message={<p>Internal Server Error.</p>}
        link={
          <Link href="/">
            <a>Return Home</a>
          </Link>
        }
      />
    </div>
  );
};

export default Custom500;
