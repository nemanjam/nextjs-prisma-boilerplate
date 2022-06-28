import React, { FC } from 'react';
import fullTwConfig from 'utils/tw-config';
import { withBem } from 'utils/bem';
import { useCreateSeed } from 'lib-client/react-query/seed/useCreateSeed';
import { useViewport } from 'components/hooks';

const Footer: FC = () => {
  const b = withBem('footer');

  const { mutate: createSeed, isLoading } = useCreateSeed();

  const { width } = useViewport();
  const sm = parseInt(fullTwConfig.theme.screens.sm, 10);

  const isIframeSmall = width < sm; // 640px, same as navbar

  return (
    <footer className={b()}>
      <span />
      <div className={b('links')}>
        <span className={b('author')}>@nemanjam 2022</span>
        <iframe
          src={`https://ghbtns.com/github-btn.html?user=nemanjam&repo=nextjs-prisma-boilerplate&type=star&count=true${
            isIframeSmall ? '' : '&size=large'
          }`}
          frameBorder="0"
          scrolling="0"
          width={isIframeSmall ? '150' : '170'}
          height={isIframeSmall ? '20' : '30'}
          title="GitHub"
        ></iframe>
      </div>
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
