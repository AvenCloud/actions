import { spawn } from '../../utils/spawn';
import yarnOrNpm from 'yarn-or-npm';
import { reportError } from '../../utils/reportError';

export async function main(): Promise<void> {
  await spawn(yarnOrNpm(), 'run', 'build');
}

if (!module.parent) main().catch(reportError);
