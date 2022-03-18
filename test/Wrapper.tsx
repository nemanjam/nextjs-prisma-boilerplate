import { ReactNode } from 'react';
import { NextRouter } from 'next/router';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { IconContext } from 'react-icons';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from 'next-themes';
import { themes as defaultThemes } from 'lib-client/constants';

export type WrapperProps = {
  children: ReactNode;
  session: Session;
  dehydratedState: unknown;
  queryClient: QueryClient;
  themes?: string[];
  routerProps?: Partial<NextRouter>;
};

/**
 * used only in tests
 */
const Wrapper = ({
  children,
  session,
  dehydratedState,
  queryClient,
  themes = defaultThemes,
  routerProps,
}: WrapperProps) => {
  return (
    <RouterContext.Provider value={{ ...createMockRouter(), ...routerProps }}>
      <SessionProvider session={session} refetchInterval={5 * 60}>
        <ThemeProvider themes={themes} attribute="class">
          <IconContext.Provider value={{ className: 'react-icons' }}>
            <QueryClientProvider client={queryClient}>
              <Hydrate state={dehydratedState}>
                {/* component, not a page */}
                {children}
              </Hydrate>
            </QueryClientProvider>
          </IconContext.Provider>
        </ThemeProvider>
      </SessionProvider>
    </RouterContext.Provider>
  );
};

export function createMockRouter(routerProps?: Partial<NextRouter>): NextRouter {
  return {
    basePath: '',
    pathname: '/',
    route: '/',
    query: {},
    asPath: '/',
    back: jest.fn(),
    beforePopState: jest.fn(),
    prefetch: jest.fn(),
    push: jest.fn(),
    reload: jest.fn(),
    replace: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    isFallback: false,
    isLocaleDomain: false,
    isReady: true,
    defaultLocale: 'en',
    domainLocales: [],
    isPreview: false,
    ...routerProps,
  };
}

export default Wrapper;
