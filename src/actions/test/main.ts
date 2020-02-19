import { spawn } from '../../utils/spawn';
import yarnOrNpm from 'yarn-or-npm';

export async function main(): Promise<void> {
  await spawn(yarnOrNpm(), 'test');

  // TODO: Add other checks
}

if (!module.parent) {
  main().then(
    () => console.log('Done with normal execution'),
    e => {
      process.exitCode = 1;
      console.log('Error in run!');
      console.log(e);
    },
  );
}
