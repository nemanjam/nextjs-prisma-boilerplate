import React, { FC, ReactNode } from 'react';
import { QueryErrorResetBoundary, useQueryErrorResetBoundary } from 'react-query';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import ErrorFallback from 'components/Error';
import { FallbackType } from 'types';

type Props = {
  children: ReactNode;
  errorFallbackType: FallbackType;
};

const ErrorBoundaryWrapper: FC<Props> = ({ children, errorFallbackType }) => {
  const { reset } = useQueryErrorResetBoundary();

  const fallbackRender = (fallbackProps: FallbackProps) => (
    <ErrorFallback {...fallbackProps} fallbackType={errorFallbackType} />
  );

  return (
    <QueryErrorResetBoundary>
      <ErrorBoundary fallbackRender={fallbackRender} onReset={reset}>
        {children}
      </ErrorBoundary>
    </QueryErrorResetBoundary>
  );
};

export default ErrorBoundaryWrapper;
