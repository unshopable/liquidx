import * as path from 'path';
import getRelativeDirnameFromAbsoluteDirname from './get-relative-dirname-from-absolute-dirname';

export default function getRootSuiteName(dirname: string) {
  const relativeDirname = getRelativeDirnameFromAbsoluteDirname(dirname);

  // Get rid of trailing slash, 'src', and '__tests__'
  const dirnameParts = relativeDirname.split(path.sep).slice(2, -1);

  return path.join(...dirnameParts);
}
