import React, { FC } from 'react';
import { withBem } from 'utils/bem';

const themeColors = [
  'primary',
  'primary-focus',
  'primary-content',
  'secondary',
  'secondary-focus',
  'secondary-content',
  'accent',
  'accent-focus',
  'accent-content',
  'neutral',
  'neutral-focus',
  'neutral-content',
  'base-100',
  'base-200',
  'base-300',
  'base-content',
  'info',
  'success',
  'warning',
  'error',
];

const PreviewTheme: FC = () => {
  const b = withBem('preview-theme');

  const bgColor = (color) => ` bg-th-${color}`;

  return (
    <div className={b()}>
      {themeColors.map((color) => (
        <div className={b('item') + bgColor(color)}>{bgColor(color)}</div>
      ))}
    </div>
  );
};

export default PreviewTheme;

// prevent purge
/*
bg-th-primary
bg-th-primary-focus
bg-th-primary-content
bg-th-secondary
bg-th-secondary-focus
bg-th-secondary-content
bg-th-accent
bg-th-accent-focus
bg-th-accent-content
bg-th-neutral
bg-th-neutral-focus
bg-th-neutral-content
bg-th-base-100
bg-th-base-200
bg-th-base-300
bg-th-base-content
bg-th-info
bg-th-success
bg-th-warning
bg-th-error
*/
