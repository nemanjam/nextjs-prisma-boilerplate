import React, { FC } from 'react';
import { withBem } from 'utils/bem';

const Loading: FC = () => {
  const b = withBem('loading');

  return <h2 className={b()}>Loading...</h2>;
};

export default Loading;
