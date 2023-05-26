import type { Options } from 'tsup';

const tsupConfig: Options = {
  entryPoints: ['src/*.ts'],
  clean: true,
  format: ['cjs', 'esm'],
  dts: true,
  onSuccess: 'npm run build:grammar',
};

export default tsupConfig;
