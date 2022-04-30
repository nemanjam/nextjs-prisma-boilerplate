import React, {
  ReactNode,
  cloneElement,
  ReactElement,
  FC,
  useRef,
  Children,
  isValidElement,
} from 'react';
import { withBem } from 'utils/bem';

type Props = {
  isActive?: boolean;
  children?: ReactNode;
  icon?: ReactElement;
  passChildRef?: boolean;
};

const NavLink: FC<Props> = ({ isActive, children, icon, passChildRef = false }) => {
  const b = withBem('navlink');
  const childRef = useRef<{ handleChange: Function }>(null);

  const childrenWithProps = Children.map(children, (child) => {
    return passChildRef && isValidElement(child)
      ? cloneElement(child, { childRef })
      : child;
  });

  const handleClick = () => {
    childRef.current?.handleChange();
  };

  return (
    <span className={b(null, { active: isActive })} onClick={handleClick}>
      {icon &&
        cloneElement(icon, {
          className: b('icon'),
        })}
      <span className={b('content')}>{childrenWithProps}</span>
    </span>
  );
};

export default NavLink;
