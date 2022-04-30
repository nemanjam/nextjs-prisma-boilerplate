import React, { FC } from 'react';
import { withBem } from 'utils/bem';
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
  align?: 'left' | 'right';
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
  align = 'left',
}) => {
  const b = withBem('pagination');

  const fetching = isFetching && <span className={b('text')}>Fetching...</span>;

  return (
    <nav className={b(null, { right: align === 'right' })}>
      <span className={b('help-text')}>
        {align === 'right' && fetching}
        <span className={b('text')}>Showing</span>
        <span className={b('number')}>{from}</span>
        <span className={b('text')}>to</span>
        <span className={b('number')}>{to}</span>
        <span className={b('text')}>of</span>
        <span className={b('number')}>{total}</span>
        <span className={b('text')}>Items</span>
        {align !== 'right' && fetching}
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

        {Array.from(Array(pagesCount).keys()) // range 1..9
          .map((_val, i) => i + 1)
          .map((index) => (
            <li
              key={index}
              className={b('list-item', {
                'hide-on-mobile': currentPage !== index,
              })}
            >
              <Button
                onClick={() => setPage?.(index)}
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
