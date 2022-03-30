import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import Wrapper, { WrapperProps } from 'test/Wrapper';
import { fakeSession } from 'test/server/fake-data';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

type CustomRenderOptionsType = Omit<RenderOptions, 'wrapper'> & {
  wrapperProps?: Partial<WrapperProps>;
};

export const customRender = (ui: ReactElement, options: CustomRenderOptionsType = {}) => {
  const { wrapperProps, ...renderOptions } = options;
  const testQueryClient = createTestQueryClient();

  // dehydratedState: unknown; queryClient.setCache()... - for pages
  // fake-data.ts file maybe common with seed maybe

  const defaultWrapperProps = {
    queryClient: testQueryClient,
    session: fakeSession,
  };

  return render(ui, {
    wrapper: (props) => <Wrapper {...props} {...defaultWrapperProps} {...wrapperProps} />,
    ...renderOptions,
  });
};

export const createWrapper = () => {
  const testQueryClient = createTestQueryClient();

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>
  );
};
