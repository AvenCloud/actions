import { input } from '../../utils/inputs';
import { prepareRemoteServer } from '../prepare/prepareRemoteServer';
import { reportError } from '../../utils/reportError';
import { spawn, exec } from '../../utils/spawn';
import { promises } from 'fs';
import { readAvenConfig } from '../../utils/readAvenConfig';
import { ensureFileIs, ensureFileContains } from '../../utils/Files';

const { mkdir } = promises;

async function setupShhConfig(): Promise<void> {
  await mkdir(`${process.env.HOME}/.ssh`, { recursive: true });

  const files: Promise<boolean>[] = [];

  const deployKey = await input('deploy-key');

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

// cSpell:ignore rsync executability

async function copySources(): Promise<void> {
  const dir = await input('deploy-directory');

  const config = await readAvenConfig();

  const serviceName = config.serviceName ?? config.domains[0];

  await spawn(
    'rsync',
    '--recursive',
    '--links',
    '--delete',
    '--executability',
    dir,
    `runtime-server:/opt/${serviceName}`,
  );
}

async function restartApplication(): Promise<void> {
  console.log('restart');

  // TODO: ssh runtime-server systemctl stop serviceName
  // TODO: migrate db
  /*
        - name: Test if server needs a restart
        id: reboot
        shell: bash {0}
        run: |
          ssh runtime-server \[ -e /var/run/reboot-required \]
          echo "::set-output name=required::$?"
  */
  // TODO: Restart one way or the other
}

export async function main(): Promise<void> {
  await setupShhConfig();

  // TODO: Secrets

  await prepareRemoteServer();

  await copySources();

  await restartApplication();
}

if (!module.parent) main().catch(reportError);
