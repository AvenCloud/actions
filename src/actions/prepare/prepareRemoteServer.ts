import { spawn, exec } from '../../utils/spawn';
import { verbosityLevel, input } from '../../utils/io';
import { Config } from '../../prepare/Config';
import { getDomains } from '../../utils/getDomains';
import { getServiceName } from '../../utils/getServiceName';

async function getAuthorizedDeployKey(): Promise<string> {
  const keyFile = `${process.env.HOME}/.ssh/id_rsa`;
  return (await exec(`ssh-keygen -y -f ${keyFile}`)).stdout.trim();
}

async function getConfig(): Promise<Config> {
  const ret = {} as Config;

  ret.domains = await getDomains();

  ret.authorizedKeys = [
    await getAuthorizedDeployKey(),
    // ...(await Promise.all(
    //   (await input('extra-keys')).split(/\s/).map(
    //     async (k): Promise<string[]> => {
    //       if (k.match(/^[^/]+$/)) k = `https://github.com/${k}.keys`;
    //       if (k.match(/^https:\/\//)) return (await request(k)).split(/\s/);
    //       return [k];
    //     },
    //   ),
    // )),
  ];

  ret.serviceName = await getServiceName();

  ret.serviceDescription = await input('service-description');

  ret.startServerCommand = await input('start-server-command');

  // TODO
  ret.webRootPath;

  ret.timezone = await input('timezone');

  ret.aptDependencies = (await input('apt-dependencies'))
    .split(/\s/)
    .filter(s => s);
  ret.runtimeAptDependencies = (await input('runtime-apt-dependencies'))
    .split(/\s/)
    .filter(s => s);

  // TODO
  ret.journalbeat;

  await input('service-name');
  await input('start-server-command');
  await input('service-configs');
  await input('service-config-files');
  await input('timezone');
  await input('apt-dependencies');
  await input('runtime-apt-dependencies');
  await input('verbosity');

  return ret;
}

export async function prepareRemoteServer(): Promise<void> {
  const verboseSSHArg: string[] = [];
  const verboseSpawnArg: string[] = [];
  const verbosity = await verbosityLevel();

  if (verbosity > 2) verboseSSHArg.push('-v');
  if (verbosity > 1) verboseSpawnArg.push('--verbose');

  // Smoke-test
  await spawn('ssh', ...verboseSSHArg, 'runtime-server', 'uptime', '-p');

  await spawn(
    'rsync',
    ...verboseSpawnArg,

    '--recursive',
    '--compress',
    '--links',
    '--executability',

    // Build script puts a `remote` folder next to action.yml in dist
    `${__dirname}/../../prepare/remote/`,

    // Deploy to home dir
    'runtime-server:',
  );

  const prepare = spawn(
    'ssh',

    ...verboseSSHArg,

    'runtime-server',

    'bash',

    'setup.sh',

    '--gh-actions',
  );

  if (!prepare.child.stdin) throw new Error('missing stdin???');

  prepare.child.stdin.end(JSON.stringify(await getConfig()));

  await prepare;
}
