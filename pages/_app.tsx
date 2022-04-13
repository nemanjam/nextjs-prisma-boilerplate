import { useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import { IconContext } from 'react-icons';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ThemeProvider } from 'next-themes';
import { themes } from 'lib-client/constants';
import MeProvider from 'lib-client/MeContext';

import 'styles/index.scss';

const App = ({
  Component,
  pageProps: { session, dehydratedState, ...pageProps },
}: AppProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
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
  );
};

export default App;

// include themes, prevent purge
// theme-light theme-dark theme-blue theme-red theme-green theme-black
