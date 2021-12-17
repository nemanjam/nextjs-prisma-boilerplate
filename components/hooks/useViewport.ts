import { useEffect, useState } from 'react';
import { useHasMounted } from 'components/hooks';

// must not use isBrowser on server, react...?
// https://github.com/vercel/next.js/discussions/17443
// https://www.joshwcomeau.com/react/the-perils-of-rehydration

const useViewport = () => {
  const hasMounted = useHasMounted();
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleWindowResize = () => setWidth(hasMounted ? window.innerWidth : 0);
    handleWindowResize(); // call it on mount too

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [hasMounted]);

  return { width };
};

export default useViewport;
