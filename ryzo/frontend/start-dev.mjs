import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
process.chdir(__dirname);

const port = process.env.PORT || 3000;
execSync(`npx next dev -p ${port}`, { stdio: 'inherit', cwd: __dirname });
