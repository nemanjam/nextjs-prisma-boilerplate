import { useEffect, useState } from 'react';
import { useIsMounted } from 'components/hooks';

// must not use isBrowser on server, react...?
// https://github.com/vercel/next.js/discussions/17443
// https://www.joshwcomeau.com/react/the-perils-of-rehydration

const useViewport = () => {
  const isMounted = useIsMounted();
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleWindowResize = () => setWidth(isMounted ? window.innerWidth : 0);
    handleWindowResize(); // call it on mount too

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [isMounted]);

  return { width };
};

export default useViewport;
