import { ReactNode } from 'react';
import { NextRouter } from 'next/router';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createMockRouter } from 'test/Wrapper';

export type HookWrapperProps = {
  children: ReactNode;
  session: Session;
  queryClient: QueryClient;
  router?: Partial<NextRouter>;
};

/**
 * used only in tests
 */
// SessionProvider for useSession in useMe
// MeProvider is not used in hooks
// RouterContext for redirect onSuccess
const HookWrapper = ({ children, session, queryClient, router }: HookWrapperProps) => {
  return (
    <RouterContext.Provider value={{ ...createMockRouter(), ...router }}>
      <SessionProvider session={session} refetchInterval={5 * 60}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </SessionProvider>
    </RouterContext.Provider>
  );
};

export default HookWrapper;
