import React, { FC } from 'react';
import { withBem } from 'utils/bem';
import { Spinner, SpinnerProps } from 'components/Loading';

type Props = {
  loaderType?: 'item' | 'page' | 'screen';
} & Pick<SpinnerProps, 'size' | 'variant'>;

const Loading: FC<Props> = ({ loaderType = 'page', ...spinnerProps }) => {
  const b = withBem('loading');

  const modifiers = {
    item: loaderType === 'item',
    page: loaderType === 'page',
    screen: loaderType === 'screen',
  };

  let content: JSX.Element;
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

    default:
      content = null;
      break;
  }

  return <div className={b(null, modifiers)}>{content}</div>;
};

export default Loading;
