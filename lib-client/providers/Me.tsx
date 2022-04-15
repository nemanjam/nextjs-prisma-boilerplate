import { createContext, FC } from 'react';
import { ClientUser } from 'types';
import { useMe } from 'lib-client/react-query/auth/useMe';
import Loading from 'components/Loading';

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
  const { data, isLoading } = useMe();

  return (
    <MeContext.Provider
      value={{
        me: data,
      }}
    >
      {isLoading ? <Loading loaderType="screen" /> : children}
    </MeContext.Provider>
  );
};

export default MeProvider;
