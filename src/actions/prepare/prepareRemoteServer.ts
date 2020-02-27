import { spawn, exec } from '../../utils/spawn';
import { verbosityLevel, input } from '../../utils/io';
import { Config } from '../../prepare/Config';
import { getDomains } from '../../utils/getDomains';
import { getServiceName } from '../../utils/getServiceName';
import { request } from '../../utils/request';
import githubUsernameRegex from 'github-username-regex';
import { exists } from '../../utils/fs';

async function getAuthorizedDeployKey(): Promise<string> {
  const keyFile = `${process.env.HOME}/.ssh/id_rsa`;
  return (await exec(`ssh-keygen -y -f ${keyFile}`)).stdout.trim();
}

async function getAuthorizedDeployKeyNew(): Promise<string | undefined> {
  const keyFile = `${process.env.HOME}/.ssh/id_rsa.2`;
  if (!(await exists(keyFile))) return;
  return (await exec(`ssh-keygen -y -f ${keyFile}`)).stdout.trim();
}

async function getConfig(): Promise<Config> {
  const ret = {} as Config;

  ret.domains = await getDomains();

  ret.authorizedKeys = [await getAuthorizedDeployKey()];

  const newKey = await getAuthorizedDeployKeyNew();

  if (newKey) ret.authorizedKeys.push(newKey);

  const extra = (await input('extra-keys')).split('\n').map(async k => {
    if (k.match(githubUsernameRegex)) k = `https://github.com/${k}.keys`;
    if (k.match(/^https:\/\//)) return (await request(k)).split('\n');

    return [k];
  });

  for (const keys of await Promise.all(extra)) {
    ret.authorizedKeys.push(...keys.filter(s => s));
  }

  ret.service = {
    name: await getServiceName(),

    description: await input('service-description'),

    startServerCommand: await input('start-server-command'),

    extraConfigs: await input('service-configs'),
  };

  // TODO
  ret.webRootPath;

  ret.runtimeServerTimezone = await input('runtime-server-timezone');

  ret.aptDependencies = (await input('apt-dependencies'))
    .split(/\s/)
    .filter(s => s);
  ret.runtimeAptDependencies = (await input('runtime-apt-dependencies'))
    .split(/\s/)
    .filter(s => s);

  const temp = {
    kibanaHost: await input('kibana-host'),
    elastic: {
      hosts: (await input('elastic-hosts')).split(/\s/).filter(s => s),
      username: await input('elastic-username'),
      password: await input('elastic-password'),
    },
    logstashHosts: (await input('logstash-hosts')).split(/\s/).filter(s => s),
  };

  if (
    temp.kibanaHost ||
    temp.elastic.hosts.length ||
    temp.logstashHosts.length
  ) {
    ret.journalbeat = temp;
  }

  // TODO
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

    { stdio: ['pipe', 'inherit', 'inherit'] },

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
