import React, { ReactNode, useRef, FC } from 'react';
import { useDetectOutsideClick } from 'components/hooks';
import { withBem } from 'utils/bem';

type Props = {
  children: ReactNode;
  items: ReactNode[];
};

const Dropdown: FC<Props> = ({ children, items }) => {
  const { menuRef, anchorRef, isActive, setIsActive } = useDetectOutsideClick();
  const b = withBem('dropdown');

  const handleAvatarClick = () => {
    // both closes and opens
    setIsActive((prevIsActive) => !prevIsActive);
  };

  return (
    <div className={b()}>
      <div className={b('container')}>
        <span onClick={handleAvatarClick} ref={anchorRef} className={b('anchor')}>
          {children}
        </span>

        <nav ref={menuRef} className={b('menu', { active: isActive })}>
          <ul className={b('list')}>
            {items?.length > 0 &&
              items.map((item, index) => (
                <li key={index} className={b('list-item')}>
                  {item}
                </li>
              ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Dropdown;
