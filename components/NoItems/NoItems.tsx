import React, { FC } from 'react';
import { withBem } from 'utils/bem';

type Props = {
  itemsType?: 'users' | 'posts';
};

const NoItems: FC<Props> = ({ itemsType = 'posts' }) => {
  const b = withBem('no-items');

  return (
    <div className={b()}>
      <div className={b('content')}>{`No ${itemsType} to display.`}</div>
    </div>
  );
};

export default NoItems;
