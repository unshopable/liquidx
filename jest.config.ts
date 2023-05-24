import { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  moduleNameMapper: {
    '^@/(.*)': '<rootDir>/src/$1',
  },

  testMatch: [`<rootDir>/src/**/__tests__/index.ts`],
};

export default config;
