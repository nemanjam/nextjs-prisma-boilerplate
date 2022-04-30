import { createContext, FC } from 'react';
import { ClientUser } from 'types/models/User';
import { useMe } from 'lib-client/react-query/auth/useMe';

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

  return <MeContext.Provider value={{ me: data || null }}>{children}</MeContext.Provider>;
};

export default MeProvider;
