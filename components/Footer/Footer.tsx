import React, { FC } from 'react';
import { withBem } from 'utils/bem';
import { useCreateSeed } from 'lib-client/react-query/seed/useCreateSeed';

const Footer: FC = () => {
  const b = withBem('footer');

  const { mutate: createSeed, isLoading } = useCreateSeed();

  return (
    <footer className={b()}>
      <span />
      <span className={b('text')}>Footer 2022</span>
      <a
        href=""
        onClick={(e) => {
          e.preventDefault();
          createSeed();
        }}
        className={b('seed-link')}
      >
        {!isLoading ? 'Reseed' : 'Seeding...'}
      </a>
    </footer>
  );
};

export default Footer;
