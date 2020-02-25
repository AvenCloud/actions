import { input } from '../../utils/io';
import { prepareRemoteServer } from '../prepare/prepareRemoteServer';
import { reportError } from '../../utils/reportError';
import { spawn, exec } from '../../utils/spawn';
import {
  mkdir,
  ensureFileIs,
  ensureFileContains,
  exists,
} from '../../utils/fs';
import { readAvenConfig } from '../../utils/readAvenConfig';

async function setupShhConfig(): Promise<void> {
  await mkdir(`${process.env.HOME}/.ssh`);

  const files: Promise<boolean>[] = [];

  const deployKey = await input('deploy-key');

  if (!deployKey) {
    throw new Error('deploy-key required! It is missing or empty.');
  }

  const identityFile = `${process.env.HOME}/.ssh/id_rsa`;

  files.push(ensureFileIs(identityFile, deployKey, 0o600));

  const host = (await readAvenConfig()).domains[0];

  // cSpell:ignore keyscan

  const hostKeys = (await exec(`ssh-keyscan ${host}`)).stdout;

  console.log('Using host keys:');
  console.log(hostKeys);

  files.push(
    ensureFileContains(`${process.env.HOME}/.ssh/known_hosts`, hostKeys),
  );

  const config = `
Host runtime-server
  HostName ${host}
  Port 22
  User root
  CheckHostIP no
`;

  files.push(ensureFileContains(`${process.env.HOME}/.ssh/config`, config));

  await Promise.all(files);
}

// cSpell:ignore executability

async function copySources(): Promise<void> {
  const dir = await input('deploy-directory');

  const config = await readAvenConfig();

  const serviceName = config.serviceName ?? config.domains[0];

  await spawn(
    'rsync',

    // Default gzip compression speeds up deploy
    '--compress',

    // Source source recursively
    '--recursive',

    // Preserve symlinks and executability
    '--links',
    '--executability',

    // Delete extraneous files on destination, even if IO errors occur
    '--delete',
    '--ignore-errors',

    // Local files to copy
    dir,

    // Remote runtime server and destination
    `runtime-server:/opt/aven/${serviceName}`,
  );
}

async function copyServiceConfigs(): Promise<void> {
  const configsRaw = await input('service-configs');

  if (!configsRaw) return;

  const configs = configsRaw.split(' ');

  const config = await readAvenConfig();

  const serviceName = config.serviceName ?? config.domains[0];

  await spawn(
    'rsync',

    '--recursive',

    // Delete extraneous files on destination, even if IO errors occur
    '--delete',
    '--ignore-errors',

    // Local files to copy
    ...configs,

    // Remote runtime server and destination
    `runtime-server:/etc/systemd/system/${serviceName}.service.d/`,
  );

  await spawn('ssh', 'runtime-server', 'systemctl', 'daemon-reload');
}

async function restartApplication(): Promise<void> {
  const config = await readAvenConfig();

  const serviceName = config.serviceName ?? config.domains[0];

  await spawn('ssh', 'runtime-server', 'systemctl', 'stop', serviceName);

  // TODO: migrate db

  if (await exists('/var/run/reboot-required')) {
    await spawn('ssh', 'runtime-server', 'reboot').catch(e => {
      console.log('Error doing remote server reboot. Probably ok.');
      console.log(e);
    });
  } else {
    await spawn('ssh', 'runtime-server', 'systemctl', 'start', serviceName);
  }
}

export async function main(): Promise<void> {
  await setupShhConfig();

  // TODO: Secrets

  await prepareRemoteServer();

  await copyServiceConfigs();

  await copySources();

  await restartApplication();
}

if (!module.parent) main().catch(reportError);
