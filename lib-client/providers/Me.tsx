import { createContext, FC } from 'react';
import { ClientUser } from 'types/models/User';
import { useMe } from 'lib-client/react-query/auth/useMe';

// context
type ContextProps = {
  me: ClientUser | null;
};

const defaultValue: ContextProps = { me: null };
export const MeContext = createContext<ContextProps | null>(defaultValue);

// provider
type ProviderProps = {
  children?: React.ReactNode;
};

const MeProvider: FC<ProviderProps> = ({ children }) => {
  const { data } = useMe();

  return <MeContext.Provider value={{ me: data }}>{children}</MeContext.Provider>;
};

export default MeProvider;
