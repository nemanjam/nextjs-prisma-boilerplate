import { MutationCache, QueryCache, QueryClientConfig } from 'react-query';

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
    onError: (error) => console.error('global Query error handler:', error),
  }),
  mutationCache: new MutationCache({
    onError: (error) => console.error('global Mutation error handler:', error),
  }),
};

export default queryClientConfig;
