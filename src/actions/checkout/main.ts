import { platform } from 'os';

import YarnOrNpm from 'yarn-or-npm';

import restore from '../../utils/cache/restore';
import { input } from '../../utils/inputs';
import { hashFiles } from '../../utils/hashFiles';
import { spawn, exec } from '../../utils/spawn';
import { readAvenConfig } from '../../utils/readAvenConfig';
import { reportError } from '../../utils/reportError';

export async function main(): Promise<void> {
  /**
   * Which ref to checkout.
   *
   * @default '${{ github.sha }}'
   */
  const ref = await input('ref');

  /**
   * Which repository to work with.
   *
   * @example "AvenCloud/actions"
   * @default '${{ github.repository }}'
   */
  const repo = await input('repo');

  /**
   * Token to use to fetch from repo with.
   *
   * @default '${{ github.token }}'
   */
  const token = await input('token');

  //
  // Get the latest source
  //

  // TODO: do this in node?
  await spawn(
    `curl -H 'Authorization: token ${token}' -H 'Accept: application/vnd.github.v3.raw' https://api.github.com/repos/${repo}/tarball/${ref} | tar xz --strip 1`,
    true,
  );

  //
  // Install system dependencies
  //

  const config = await readAvenConfig();

  if (config) {
    if (config.aptDependencies) {
      await spawn('apt-get', 'install', '-y', ...config.aptDependencies);
    }
  }
  // TODO: Support more than just apt packages?

  //
  // Caching
  //

  const hash = hashFiles('package-lock.json', 'yarn.lock');

  const nodeKeys = [
    `node_modules-${platform()}-abi${process.versions.modules}-${await hash}`,
    `node_modules-${platform()}-abi${process.versions.modules}-`,
  ];

  await restore({ path: 'node_modules', keys: nodeKeys });

  if (YarnOrNpm() === 'yarn') {
    const yarnCache = await exec('yarn cache dir');

    // Remove trailing "\n"
    const path = yarnCache.stdout.slice(0, -1);

    const yarnKeys = [
      `yarn-${platform()}-build-${await hash}`,
      `yarn-${platform()}-`,
    ];

    await restore({ path, keys: yarnKeys });

    await spawn('yarn', 'install', '--frozen-lockfile');
  } else {
    const npmKeys = [
      `npm-${platform()}-build-${await hash}`,
      `npm-${platform()}-`,
    ];

    await restore({ path: '~/.npm', keys: npmKeys });

    await spawn('npm', 'ci');
  }
}

if (!module.parent) main().catch(reportError);
