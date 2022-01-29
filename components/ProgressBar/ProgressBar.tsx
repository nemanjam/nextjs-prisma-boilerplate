import React, { FC } from 'react';
import { withBem } from 'utils/bem';

type Props = {
  progress: number;
  height?: 'base' | 'sm';
};

const ProgressBar: FC<Props> = ({ progress = 0, height = 'base' }) => {
  const b = withBem('progress-bar');

  const modifiers = {
    'height-sm': height === 'sm',
    'height-base': height === 'base',
    active: progress > 0,
  };

  return (
    <div className={b(null, modifiers)}>
      <div className={b('bar')} style={{ width: `${progress}%` }} />
    </div>
  );
};

export default ProgressBar;
