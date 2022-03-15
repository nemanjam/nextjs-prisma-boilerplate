import { ReactNode } from 'react';
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
}: WrapperProps) => {
  return (
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
  );
};

export default Wrapper;
