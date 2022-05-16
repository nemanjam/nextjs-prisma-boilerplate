import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient } from 'react-query';
import Wrapper, { WrapperProps } from 'test-client/Wrapper';
import { fakeSession } from 'test-client/server/fake-data';
import HookWrapper, { HookWrapperProps } from 'test-client/HookWrapper';
import queryClientConfig from 'lib-client/react-query/queryClientConfig';

const createTestQueryClient = () =>
  new QueryClient({
    ...queryClientConfig,
    defaultOptions: {
      ...queryClientConfig.defaultOptions,
      queries: {
        ...queryClientConfig.defaultOptions?.queries,
        retry: false,
      },
    },
    // silence react-query errors
    logger: {
      log: console.log,
      warn: console.warn,
      /* eslint-disable @typescript-eslint/no-empty-function */
      error: () => {},
    },
  });

type CustomRenderOptionsType = Omit<RenderOptions, 'wrapper'> & {
  wrapperProps?: Partial<WrapperProps>;
};

export const customRender = (ui: ReactElement, options: CustomRenderOptionsType = {}) => {
  const { wrapperProps, ...renderOptions } = options;
  const testQueryClient = createTestQueryClient();

  // dehydratedState: unknown; queryClient.setCache()... - for pages
  // fake-data.ts file maybe common with seed

  const defaultWrapperProps = {
    queryClient: testQueryClient,
    session: fakeSession,
  };

  return render(ui, {
    wrapper: (props) => <Wrapper {...props} {...defaultWrapperProps} {...wrapperProps} />,
    ...renderOptions,
  });
};

type WrapperPropsType = Partial<Omit<HookWrapperProps, 'children'>>;

export const createWrapper = (wrapperProps: WrapperPropsType = {}) => {
  const testQueryClient = createTestQueryClient();

  const defaultWrapperProps = {
    queryClient: testQueryClient,
    session: fakeSession,
  };

  return ({ children }: { children: ReactNode }) => (
    <HookWrapper {...defaultWrapperProps} {...wrapperProps}>
      {children}
    </HookWrapper>
  );
};
