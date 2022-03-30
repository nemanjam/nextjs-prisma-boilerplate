import { loadEnvConfig } from '@next/env';

console.log('jest.env.setup.ts loaded...');

// load env vars from .env.test and .env.test.local
const rootDirAbsolutePath = process.cwd();
loadEnvConfig(rootDirAbsolutePath);
