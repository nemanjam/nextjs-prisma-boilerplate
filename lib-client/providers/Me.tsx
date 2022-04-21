import { createContext, FC } from 'react';
import { ClientUser } from 'types/models/User';
import { useMe } from 'lib-client/react-query/auth/useMe';
import { useIsMounted } from 'components/hooks';

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

/**
 * Must NOT be used ABOVE pages (_app.tsx). Use it in Layouts.
 * Only passes 'me'.
 */
const MeProvider: FC<ProviderProps> = ({ children }) => {
  // prevent inconsistent state Server:x , Client:y error
  const isMounted = useIsMounted();
  const { data } = useMe();

  return (
    <MeContext.Provider value={{ me: data }}>
      {isMounted ? children : null}
    </MeContext.Provider>
  );
};

export default MeProvider;
