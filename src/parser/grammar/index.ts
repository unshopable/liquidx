import * as fs from 'fs';
import * as ohm from 'ohm-js';
import * as path from 'path';

export const grammars = ohm.grammars(fs.readFileSync(path.join(__dirname, 'liquidx.ohm'), 'utf8'));

export default grammars['LiquidX'];
