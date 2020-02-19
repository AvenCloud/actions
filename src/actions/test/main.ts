import { spawn } from '../../utils/spawn';
import yarnOrNpm from 'yarn-or-npm';
import { reportError } from '../../utils/reportError';

export async function main(): Promise<void> {
  await spawn(yarnOrNpm(), 'test');

  // TODO: Add other checks
}

if (!module.parent) {
  main().then(() => console.log('Done with normal execution'), reportError);
}
