import { ensureFileIs } from '../../utils/fs';
import { spawn, exec } from '../../utils/spawn';
import { readAvenConfig } from '../../utils/readAvenConfig';

const deps: string[] = [];

// List of apt dependencies needed by various parts

export function addAptDependencies(...dependencies: string[]): void {
  deps.push(...dependencies);
}

export async function setupAptDependencies(): Promise<void> {
  // TODO: Don't assume yarn

  await exec(
    'curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -',
  );
  await ensureFileIs(
    '/etc/apt/sources.list.d/yarn.list',
    'deb https://dl.yarnpkg.com/debian/ stable main',
  );
  addAptDependencies('yarn');

  await spawn('apt-get', 'update');

  await spawn('apt-get', 'upgrade', '-y');

  const config = await readAvenConfig();

  addAptDependencies(...(config.aptDependencies ?? []));
  addAptDependencies(...(config.runtimeAptDependencies ?? []));

  // cSpell:ignore noninteractive autoremove confnew confdef confold dpkg

  const useNew = true;

  const dpkgForceConfOptions = useNew
    ? 'force-confnew'
    : 'force-confdef\nforce-confold';

  await ensureFileIs(
    '/etc/dpkg/dpkg.cfg.d/force-conf.cfg',
    `${dpkgForceConfOptions}\n`,
  );

  await spawn(
    'apt-get',
    // Avoid all interactive prompts https://serverfault.com/questions/227190
    {
      stdio: 'inherit',
      env: { ...process.env, DEBIAN_FRONTEND: 'noninteractive' },
    },
    'install',
    '-yq',
    ...new Set(deps),
  );

  await spawn('apt-get', 'autoremove', '-y');
}
