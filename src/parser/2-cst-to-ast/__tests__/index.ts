import { getRootSuiteName, requireAll } from '@/utils/tests';

describe(getRootSuiteName(__dirname), () => {
  requireAll(__dirname);
});
