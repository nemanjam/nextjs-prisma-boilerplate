import { useEffect, useState } from 'react';

// https://github.com/vercel/next.js/discussions/17443
// must be like this for Next.js SSR server state === client state

/**
 * isMounted === !isSSR
 */
const useIsMounted = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
};

export default useIsMounted;
