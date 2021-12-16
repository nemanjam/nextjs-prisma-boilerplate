import React, { ReactNode, useRef, FC } from 'react';
import { useDetectOutsideClick } from 'components/hooks';

type Props = {
  children: ReactNode;
  items: ReactNode[];
};

const Dropdown: FC<Props> = ({ children, items }) => {
  const dropdownRef = useRef(null);
  const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false);

  return (
    <div className="container">
      <div className="menu-container">
        <button onClick={() => setIsActive(!isActive)} className="menu-trigger">
          {children}
        </button>

        <nav ref={dropdownRef} className={`menu ${isActive ? 'active' : 'inactive'}`}>
          <ul>
            {items?.length > 0 && items.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Dropdown;
