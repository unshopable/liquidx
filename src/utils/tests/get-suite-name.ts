import getRelativeDirnameFromAbsoluteDirname from './get-relative-dirname-from-absolute-dirname';

export default function getSuiteName(dirname: string, { isDir = false } = {}) {
  const relativeDirname = getRelativeDirnameFromAbsoluteDirname(dirname);

  if (isDir) {
    return relativeDirname.split('__tests__/')[1];
  }

  const filename = dirname.split('/').at(-1);
  const filenameWithoutExtension = filename!.split('.')[0];

  return filenameWithoutExtension;
}
