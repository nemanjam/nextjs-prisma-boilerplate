import React, { FC, ReactNode } from 'react';
import { withBem } from 'utils/bem';
import Navbar from 'components/Navbar';
import Footer from 'components/Footer';
import MeProvider from 'lib-client/providers/Me';
import ErrorBoundaryWrapper from 'lib-client/providers/ErrorBoundaryWrapper';
import SuspenseWrapper from 'lib-client/providers/SuspenseWrapper';

type Props = {
  children: ReactNode;
  noPaddingTop?: boolean;
};

const PageLayout: FC<Props> = ({ children, noPaddingTop }) => {
  const b = withBem('page-layout');

  return (
    <SuspenseWrapper loaderType="screen">
      <MeProvider>
        <div className={b()}>
          <Navbar />
          <div className={b('navbar-placeholder')} />

          <main className={b('content', { 'no-padding-top': noPaddingTop })}>
            {/* Views (page) level loading and error handling*/}
            <ErrorBoundaryWrapper errorFallbackType="page">
              <SuspenseWrapper loaderType="page">{children}</SuspenseWrapper>
            </ErrorBoundaryWrapper>
          </main>

          <Footer />
        </div>
      </MeProvider>
    </SuspenseWrapper>
  );
};

export default PageLayout;
