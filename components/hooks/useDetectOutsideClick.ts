import { useState, useEffect, Dispatch, SetStateAction, useRef, RefObject } from 'react';

type HookReturnType = {
  menuRef: RefObject<HTMLElement>;
  anchorRef: RefObject<HTMLElement>;
  isActive: boolean;
  setIsActive: Dispatch<SetStateAction<boolean>>;
};

// 2 seters problem
// both handlers triggered on first click
const useDetectOutsideClick = (): HookReturnType => {
  const menuRef = useRef<HTMLElement>(null);
  // anchorRef is optional
  const anchorRef = useRef<HTMLElement>(null);
  // state and setter must be exposed outside of hook
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const isInsideAnchor =
        anchorRef.current !== null && anchorRef.current.contains(event.target as Node);

      const isOutsideMenu =
        menuRef.current !== null && !menuRef.current.contains(event.target as Node);

      if (!isInsideAnchor && isOutsideMenu) {
        setIsActive(false); // only closes
      }
    };

    // only if menu is open listen for clicks outside
    if (isActive) {
      window.addEventListener('click', onClick);
    }

    return () => {
      window.removeEventListener('click', onClick);
    };
  }, [isActive, menuRef, anchorRef]);

  return { menuRef, anchorRef, isActive, setIsActive };
};

export default useDetectOutsideClick;
