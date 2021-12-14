import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import 'styles/globals.scss';
import 'styles/components.scss';

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  return (
    <SessionProvider session={session} refetchInterval={5 * 60}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default App;
