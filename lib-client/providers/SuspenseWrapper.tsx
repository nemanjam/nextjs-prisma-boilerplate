import React, { FC, ReactNode, Suspense } from 'react';
import { QueryErrorResetBoundary, useQueryErrorResetBoundary } from 'react-query';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import ErrorFallback from 'components/Error';
import Loading from 'components/Loading';
import { FallbackType } from 'types';

type Props = {
  children: ReactNode;
  errorFallbackType: FallbackType;
  loaderType: FallbackType | 'test';
};

// used in _app.tsx, PageLayout and test Wrapper
const SuspenseWrapper: FC<Props> = ({ children, errorFallbackType, loaderType }) => {
  const { reset } = useQueryErrorResetBoundary();

  const fallbackRender = (fallbackProps: FallbackProps) => (
    <ErrorFallback {...fallbackProps} fallbackType={errorFallbackType} />
  );

  return (
    <QueryErrorResetBoundary>
      <ErrorBoundary fallbackRender={fallbackRender} onReset={reset}>
        <Suspense fallback={<Loading loaderType={loaderType} />}>{children}</Suspense>
      </ErrorBoundary>
    </QueryErrorResetBoundary>
  );
};

export default SuspenseWrapper;
