import React, { ReactNode, cloneElement, ReactElement } from 'react';
import { withBem } from 'utils/bem';

type Props = {
  isActive?: boolean;
  children?: ReactNode;
  icon?: ReactElement;
};

const NavLink: React.FC<Props> = ({ isActive, children, icon }) => {
  const b = withBem('navlink');

  return (
    <span className={b(null, { active: isActive })}>
      {icon &&
        cloneElement(icon, {
          className: b('icon'),
        })}
      <span className={b('content')}>{children}</span>
    </span>
  );
};

export default NavLink;
