import React, { FC, ReactNode, Suspense } from 'react';
import { withBem } from 'utils/bem';
import Navbar from 'components/Navbar';
import Footer from 'components/Footer';
import { QueryErrorResetBoundary, useQueryErrorResetBoundary } from 'react-query';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import ErrorFallback from 'components/Error';
import Loading from 'components/Loading';

type Props = {
  children: ReactNode;
  noPaddingTop?: boolean;
};

const PageLayout: FC<Props> = ({ children, noPaddingTop }) => {
  const b = withBem('page-layout');
  const { reset } = useQueryErrorResetBoundary();

  const fallbackRender = (fallbackProps: FallbackProps) => (
    <ErrorFallback {...fallbackProps} fallbackType="page" />
  );

  return (
    <div className={b()}>
      <Navbar />
      <div className={b('navbar-placeholder')} />

      <main className={b('content', { 'no-padding-top': noPaddingTop })}>
        {/* Views (page) level loading and error handling*/}
        <QueryErrorResetBoundary>
          <ErrorBoundary fallbackRender={fallbackRender} onReset={reset}>
            <Suspense fallback={<Loading loaderType="page" />}>{children}</Suspense>
          </ErrorBoundary>
        </QueryErrorResetBoundary>
      </main>

      <Footer />
    </div>
  );
};

export default PageLayout;
