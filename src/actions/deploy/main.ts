import { input } from '../../utils/io';
import { prepareRemoteServer } from '../prepare/prepareRemoteServer';
import { reportError } from '../../utils/reportError';
import { spawn, exec } from '../../utils/spawn';
import { mkdir, ensureFileIs, ensureFileContains } from '../../utils/fs';
import { getRuntimeHost } from '../../utils/getRuntimeHost';
import { getServiceName } from '../../utils/getServiceName';

/**
 * Setup the action runtime ssh settings that will be used for deploy.
 */
async function setupShhConfig(): Promise<void> {
  await mkdir(`${process.env.HOME}/.ssh`);

  const files: Array<Promise<boolean>> = [];

  const deployKey = await input('deploy-key');
  const deployKeyNew = await input('deploy-key-new');

  const mainKey = deployKey || deployKeyNew;

  if (!mainKey) {
    throw new Error('deploy-key required! It is missing or empty.');
  }

  const identityFile = `${process.env.HOME}/.ssh/id_rsa`;
  const identityFileNew = `${process.env.HOME}/.ssh/id_rsa.2`;

  files.push(ensureFileIs(identityFile, mainKey.trim() + '\n', 0o600));

  if (deployKey && deployKeyNew) {
    files.push(
      ensureFileIs(identityFileNew, deployKeyNew.trim() + '\n', 0o600),
    );
  }

  // cSpell:ignore keyscan

  const runtimeHost = await getRuntimeHost();
  const runtimeHostPort = (await input('runtime-host-port')) || '22';

  const hostKeys = await input('runtime-host-keys');
  // (await exec(`ssh-keyscan -p ${runtimeHostPort} ${runtimeHost}`)).stdout;

  if (hostKeys) {
    console.log('Adding host keys:');
    console.log(hostKeys);

    files.push(
      ensureFileContains(`${process.env.HOME}/.ssh/known_hosts`, hostKeys),
    );
  }

  const config = `
Host runtime-server
  HostName ${runtimeHost}
  Port ${runtimeHostPort}
  User root
  CheckHostIP no
  StrictHostKeyChecking no
`;

  files.push(ensureFileContains(`${process.env.HOME}/.ssh/config`, config));

  await Promise.all(files);
}

// cSpell:ignore executability

async function copySources(): Promise<void> {
  const dir = await input('deploy-directory');

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
    `runtime-server:/opt/aven/${await getServiceName()}`,
  );
}

async function copyServiceConfigs(): Promise<void> {
  const configsRaw = await input('service-config-files');

  if (!configsRaw) return;

  const configs = configsRaw.split(' ');

  await spawn(
    'rsync',

    '--recursive',

    // Delete extraneous files on destination, even if IO errors occur
    '--delete',
    '--ignore-errors',

    // Local files to copy
    ...configs,

    // Remote runtime server and destination
    `runtime-server:/etc/systemd/system/${await getServiceName()}.service.d/`,
  );

  await spawn('ssh', 'runtime-server', 'systemctl', 'daemon-reload');
}

async function restartApplication(): Promise<void> {
  const serviceName = await getServiceName();

  if ((await input('disable-service')) !== 'yes')
    await spawn('ssh', 'runtime-server', 'systemctl', 'stop', serviceName);

  // TODO: migrate db

  if (
    await exec('ssh ls /var/run/reboot-required').then(
      () => true,
      () => false,
    )
  ) {
    await spawn('ssh', 'runtime-server', 'reboot').catch(e => {
      console.log('Error doing remote server reboot. Probably ok.');
      console.log(e);
    });
  } else {
    if ((await input('disable-service')) !== 'yes')
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
