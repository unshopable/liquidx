import * as fs from 'fs';
import * as path from 'path';
import getSuiteName from './get-suite-name';

const TEST_ONLY: string | undefined = process.env.TEST_ONLY;

export default function requireAll(directory: string) {
  const files = fs.readdirSync(directory);

  files.forEach((file) => {
    const filePath = path.join(directory, file);

    if (filePath.endsWith('__snapshots__')) return;

    const filePathWithoutTestsPrefix = filePath.replace('__tests__/', '');

    if (TEST_ONLY && !filePathWithoutTestsPrefix.match(new RegExp(TEST_ONLY, 'i'))) {
      test.skip('', () => {
        expect(true).toBe(true);
      });

      return;
    }

    if (fs.statSync(filePath).isDirectory()) {
      describe(getSuiteName(filePath, { isDir: true }), () => {
        require(path.join(filePath, 'index.ts'));
      });
    } else if (filePath.match(/.+\.test\.ts/)) {
      describe(getSuiteName(filePath), () => {
        require(filePath);
      });
    }
  });
}
