import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient } from 'react-query';
import Wrapper, { WrapperProps } from 'test/Wrapper';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

type CustomRenderOptionsType = Omit<RenderOptions, 'wrapper'> & {
  wrapperProps?: WrapperProps;
};

export const customRender = (ui: ReactElement, options?: CustomRenderOptionsType) => {
  const { wrapperProps, ...renderOptions } = options;
  const testQueryClient = createTestQueryClient();

  // session: Session;
  // dehydratedState: unknown;
  // queryClient: QueryClient;

  return render(ui, {
    wrapper: (props) => (
      <Wrapper {...props} queryClient={testQueryClient} {...wrapperProps} />
    ),
    ...renderOptions,
  });
};
