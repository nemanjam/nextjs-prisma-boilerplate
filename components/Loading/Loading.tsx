import React, { FC } from 'react';
import { withBem } from 'utils/bem';
import { Spinner, SpinnerProps } from 'components/Loading';
import { FallbackType } from 'types';

type Props = {
  loaderType: FallbackType | 'test';
} & Pick<SpinnerProps, 'size' | 'variant'>;

const Loading: FC<Props> = ({ loaderType, ...spinnerProps }) => {
  const b = withBem('loading');

  const modifiers = {
    item: loaderType === 'item',
    page: loaderType === 'page',
    screen: loaderType === 'screen',
  };

  let content: JSX.Element | null;
  switch (loaderType) {
    case 'item':
      // item and page same for now
      content = <Spinner className={b('item')} {...spinnerProps} />;
      break;

    case 'page':
      content = <Spinner className={b('page')} {...spinnerProps} />;
      break;

    case 'screen':
      content = <Spinner className={b('screen')} size="lg" {...spinnerProps} />;
      break;

    case 'test':
      content = <span data-testid="loading">Loading</span>;
      break;

    default:
      content = null;
      break;
  }

  return <div className={b(null, modifiers)}>{content}</div>;
};

export default Loading;
