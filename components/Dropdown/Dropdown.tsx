import React, { ReactNode, useRef, FC } from 'react';
import { useDetectOutsideClick } from 'components/hooks';
import { withBem } from 'utils/bem';

type Props = {
  children: ReactNode;
  items: ReactNode[];
};

const Dropdown: FC<Props> = ({ children, items }) => {
  const dropdownRef = useRef(null);
  const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false);
  const b = withBem('dropdown');

  const handleClick = () => {
    setIsActive((prevIsActive) => !prevIsActive);
  };

  return (
    <div className={b()}>
      <div className={b('container')}>
        <span onClick={handleClick} className={b('anchor')}>
          {children}
        </span>

        <nav ref={dropdownRef} className={b('menu', { active: isActive })}>
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
