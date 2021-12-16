import React, { useState } from 'react';
import { isBrowser } from 'utils';

const useViewport = () => {
  const getWidth = () => (isBrowser() ? window.innerWidth : 0);
  const [width, setWidth] = useState(getWidth());

  React.useEffect(() => {
    const handleWindowResize = () => setWidth(getWidth());
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  return { width };
};

export default useViewport;
