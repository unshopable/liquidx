import fs from 'fs';
import path from 'path';

async function run() {
  const source = path.resolve(process.cwd(), 'src/parser/grammar/liquidx.ohm');
  const target = path.resolve(process.cwd(), 'dist/liquidx.ohm');

  fs.copyFileSync(source, target);
}

run();
