import { Suspense, useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import { IconContext } from 'react-icons';
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
  QueryErrorResetBoundary,
  useQueryErrorResetBoundary,
} from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ThemeProvider } from 'next-themes';
import { themes } from 'lib-client/constants';
import MeProvider from 'lib-client/providers/Me';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import Loading from 'components/Loading';
import ErrorFallback from 'components/Error';
import queryClientConfig from 'lib-client/react-query/queryClientConfig';

import 'styles/index.scss';

const App = ({
  Component,
  pageProps: { session, dehydratedState, ...pageProps },
}: AppProps) => {
  const { reset } = useQueryErrorResetBoundary();
  const [queryClient] = useState(() => new QueryClient(queryClientConfig));

  const fallbackRender = (fallbackProps: FallbackProps) => (
    <ErrorFallback {...fallbackProps} fallbackType="screen" />
  );

  return (
    <QueryErrorResetBoundary>
      <ErrorBoundary fallbackRender={fallbackRender} onReset={reset}>
        <Suspense fallback={<Loading loaderType="screen" />}>
          <SessionProvider session={session} refetchInterval={5 * 60}>
            <ThemeProvider themes={themes} attribute="class">
              <IconContext.Provider value={{ className: 'react-icons' }}>
                <QueryClientProvider client={queryClient}>
                  <Hydrate state={dehydratedState}>
                    <MeProvider>
                      <Component {...pageProps} />
                    </MeProvider>
                  </Hydrate>
                  <ReactQueryDevtools />
                </QueryClientProvider>
              </IconContext.Provider>
            </ThemeProvider>
          </SessionProvider>
        </Suspense>
      </ErrorBoundary>
    </QueryErrorResetBoundary>
  );
};

export default App;

// include themes, prevent purge
// theme-light theme-dark theme-blue theme-red theme-green theme-black
