import React, { FC } from 'react';
import { withBem } from 'utils/bem';
import _ from 'lodash';
import Button from 'components/Button';

type Props = {
  onPreviousClick?: () => void;
  onNextClick?: () => void;
  setPage?: (page: number) => void;
  isPreviousDisabled?: boolean;
  isNextDisabled?: boolean;
  currentPage?: number;
  pagesCount?: number;
  isFetching?: boolean;
  from?: number;
  to?: number;
  total?: number;
};

const Pagination: FC<Props> = ({
  onPreviousClick,
  onNextClick,
  setPage,
  isPreviousDisabled,
  isNextDisabled,
  currentPage,
  pagesCount,
  isFetching,
  from,
  to,
  total,
}) => {
  const b = withBem('pagination');

  return (
    <nav className={b()}>
      <span className={b('help-text')}>
        <span className={b('text')}>Showing</span>
        <span className={b('number')}>{from}</span>
        <span className={b('text')}>to</span>
        <span className={b('number')}>{to}</span>
        <span className={b('text')}>of</span>
        <span className={b('number')}>{total}</span>
        <span className={b('text')}>Items</span>
        {isFetching && <span className={b('text')}>Fetching...</span>}
      </span>

      <ul className={b('list')}>
        <li>
          <Button
            onClick={onPreviousClick}
            disabled={isPreviousDisabled}
            variant="transparent"
          >
            Prev
          </Button>
        </li>

        {_.range(1, pagesCount + 1).map((index) => (
          <li key={index}>
            <Button
              onClick={() => setPage(index)}
              variant={currentPage === index ? 'primary' : 'transparent'}
            >
              {index}
            </Button>
          </li>
        ))}

        <li>
          <Button onClick={onNextClick} disabled={isNextDisabled} variant="transparent">
            Next
          </Button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
