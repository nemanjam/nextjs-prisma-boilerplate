import { MutationCache, QueryCache, QueryClientConfig } from 'react-query';
import { getAxiosErrorMessage } from 'lib-client/react-query/axios';
import { AxiosError } from 'axios';

const formatError = (handlerName: 'Query' | 'Mutation', error: unknown): void =>
  console.error(
    `Global ${handlerName} error handler. `,
    'Message:',
    getAxiosErrorMessage(error as AxiosError),
    'Error object:',
    error
  );

const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      suspense: true,
      useErrorBoundary: true,
    },
    mutations: {
      useErrorBoundary: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => formatError('Query', error),
  }),
  mutationCache: new MutationCache({
    onError: (error) => formatError('Mutation', error),
  }),
};

export default queryClientConfig;
