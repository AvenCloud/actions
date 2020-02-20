import { spawn } from '../../utils/spawn';
import { verbosityLevel } from '../../utils/io';

export async function prepareRemoteServer(): Promise<void> {
  const verboseSSHArg: string[] = [];
  const verboseSpawnArg: string[] = [];
  const verbosity = await verbosityLevel();

  if (verbosity > 2) verboseSSHArg.push('-v');

  await spawn('ssh', ...verboseSSHArg, 'runtime-server', 'uptime', '-p');

  if (verbosity > 1) verboseSpawnArg.push('--verbose');

  await spawn(
    'rsync',
    ...verboseSpawnArg,

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

  await spawn('ssh', ...verboseSSHArg, 'runtime-server', 'bash', 'setup.sh');
}
