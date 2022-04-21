import React, { FC, ReactNode } from 'react';
import { withBem } from 'utils/bem';
import Navbar from 'components/Navbar';
import Footer from 'components/Footer';
import SuspenseWrapper from 'lib-client/providers/SuspenseWrapper';
import MeProvider from 'lib-client/providers/Me';

type Props = {
  children: ReactNode;
  noPaddingTop?: boolean;
};

const PageLayout: FC<Props> = ({ children, noPaddingTop }) => {
  const b = withBem('page-layout');

  return (
    <MeProvider>
      <div className={b()}>
        <Navbar />
        <div className={b('navbar-placeholder')} />

        <main className={b('content', { 'no-padding-top': noPaddingTop })}>
          {/* Views (page) level loading and error handling*/}
          <SuspenseWrapper errorFallbackType="page" loaderType="page">
            {children}
          </SuspenseWrapper>
        </main>

        <Footer />
      </div>
    </MeProvider>
  );
};

export default PageLayout;
