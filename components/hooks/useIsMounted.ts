import { useCallback, useEffect, useRef, useState } from 'react';

// https://github.com/vercel/next.js/discussions/17443
// must be like this for Next.js SSR server state === client state

const useIsMounted = () => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
};

// https://stackoverflow.com/questions/59524063/useeffect-cant-perform-a-react-state-update-on-an-unmounted-component

const ___useIsMounted = () => {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  return useCallback(() => isMounted.current, []);
};

export default useIsMounted;
