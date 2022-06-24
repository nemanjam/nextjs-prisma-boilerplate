import { loadEnvConfig } from '@next/env';
import { isGithubActionsAppEnv } from 'utils';

if (!isGithubActionsAppEnv()) {
  console.log('jest.env.setup.ts loaded...');

  // load env vars from .env.test and .env.test.local
  const rootDirAbsolutePath = __dirname;
  loadEnvConfig(rootDirAbsolutePath);
}
