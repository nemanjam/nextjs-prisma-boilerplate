import React, { FC } from 'react';
import Link from 'next/link';
import { FaCat } from 'react-icons/fa';
import { withBem } from 'utils/bem';
import ErrorCard from 'components/Error/ErrorCard';

const NotFound: FC = () => {
  const b = withBem('not-found');

  return (
    <div className={b()}>
      <ErrorCard
        title="Page not found 404"
        icon={<FaCat />}
        message={<p>Page you are looking for does not exist.</p>}
        link={
          <Link href="/">
            <a>Return Home</a>
          </Link>
        }
      />
    </div>
  );
};

export default NotFound;
