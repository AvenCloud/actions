import { spawn } from '../../utils/spawn';
import { verbosityLevel } from '../../utils/io';

export async function prepareRemoteServer(): Promise<void> {
  const verboseArg: string[] = [];
  const verbosity = await verbosityLevel();

  if (verbosity > 1) verboseArg.unshift('--verbose');

  await spawn('ssh', ...verboseArg, 'runtime-server', 'uptime', '-p');

  await spawn(
    'rsync',
    ...verboseArg,

    '--compress',
    '--links',
    '--executability',

    // Build script puts a `remote` folder next to action.yml in dist
    `${__dirname}/../remote/`,

    'aven.json',

    // TODO ...
    // 'secrets.json',

    // Deploy to home dir
    'runtime-server:',
  );

  await spawn('ssh', ...verboseArg, 'runtime-server', 'bash', 'setup.sh');
}
