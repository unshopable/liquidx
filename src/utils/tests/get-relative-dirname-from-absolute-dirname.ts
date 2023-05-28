export default function getRelativeDirnameFromAbsoluteDirname(dirname: string) {
  return dirname.replace(process.cwd(), '');
}
