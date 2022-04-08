import React, { FC } from 'react';
import { withBem } from 'utils/bem';

type Props = {
  isItem?: boolean;
};

const Loading: FC<Props> = ({ isItem = false }) => {
  const b = withBem('loading');

  const modifiers = {
    'is-item': isItem,
  };

  return <div className={b(null, modifiers)}>Loading...</div>;
};

export default Loading;
