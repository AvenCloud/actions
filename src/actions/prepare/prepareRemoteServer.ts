import { spawn } from '../../utils/spawn';

export async function prepareRemoteServer(): Promise<void> {
  await spawn('ssh', 'runtime-server', 'uptime', '-p');

  await spawn(
    'rsync',

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

  await spawn('ssh', 'runtime-server', 'bash', 'setup.sh');
}
