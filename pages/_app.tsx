import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import { IconContext } from 'react-icons';

import 'styles/globals.scss';
import 'styles/components.scss';
import 'styles/views.scss';

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  return (
    <SessionProvider session={session} refetchInterval={5 * 60}>
      <IconContext.Provider value={{ className: 'react-icons' }}>
        <Component {...pageProps} />
      </IconContext.Provider>
    </SessionProvider>
  );
};

export default App;
