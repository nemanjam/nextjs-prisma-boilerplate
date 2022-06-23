import { createContext, FC, useMemo } from 'react';
import { ClientUser } from 'types/models/User';
import { useMe } from 'lib-client/react-query/auth/useMe';
import SuspenseWrapper from 'lib-client/providers/SuspenseWrapper';

// context
type ContextProps = {
  me: ClientUser | null;
};

const defaultValue: ContextProps = { me: null };
export const MeContext = createContext<ContextProps>(defaultValue);

// provider
type ProviderProps = {
  children?: React.ReactNode;
};

/**
 * Must NOT be used ABOVE pages (_app.tsx). Use it in Layouts.
 * Only passes 'me'.
 * Every page must prefetch me in getServerSideProps separately.
 */
const MeProvider: FC<ProviderProps> = ({ children }) => {
  const { data } = useMe();
  const me = data ?? null;

  // memoize children, fix for: Suspense boundary received an update before it finished hydrating
  // https://github.com/facebook/react/issues/24476#issuecomment-1127800350
  // const memoChildren = useMemo(() => children, [me]);

  return (
    <SuspenseWrapper loaderType="screen">
      <MeContext.Provider value={{ me }}>{children}</MeContext.Provider>
    </SuspenseWrapper>
  );
};

export default MeProvider;
