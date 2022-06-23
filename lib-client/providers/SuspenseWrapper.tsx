import React, { FC, ReactNode, Suspense } from 'react';
import Loading from 'components/Loading';
import { FallbackType } from 'types';

type Props = {
  children: ReactNode;
  loaderType: FallbackType;
};

const SuspenseWrapper: FC<Props> = ({ children, loaderType }) => {
  return <Suspense fallback={<Loading loaderType={loaderType} />}>{children}</Suspense>;
};

export default SuspenseWrapper;
