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
