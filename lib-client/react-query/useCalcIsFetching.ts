import usePrevious from 'components/hooks/usePrevious';
import { useEffect, useState } from 'react';

type Props = { isFetching: boolean; state: unknown };

// isFetching lasts longer than prevState !== state
// keep separate state and track changes

const useCalcIsFetching = ({ isFetching, state }: Props): boolean => {
  const [isCurrentFetching, setIsCurrentFetching] = useState(false);
  const prevState = usePrevious(state);

  useEffect(() => {
    // on
    if (!isCurrentFetching && prevState !== state && isFetching) {
      setIsCurrentFetching(true);
    }

    // off
    if (isCurrentFetching && !isFetching) {
      setIsCurrentFetching(false);
    }
  }, [isFetching, state, prevState, isCurrentFetching]);

  return isCurrentFetching;
};

export default useCalcIsFetching;
