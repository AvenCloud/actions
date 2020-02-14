import { input } from '../utils/inputs';
import { spawn, exec } from '../utils/spawn';

import { promises } from 'fs';
import { platform } from 'os';
import restore from '../utils/cache/restore';

const { access } = promises;

async function exists(filePath: string): Promise<boolean> {
  return access(filePath).then(
    () => true,
    () => false,
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function hashFiles(...globs: string[]): Promise<string> {
  // TODO: implement correctly
  return await input('ref');
}

// Other packages https://github.com/actions/toolkit/blob/master/README.md#packages

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

  // TODO: do this in node?
  await spawn(
    `curl -H 'Authorization: token ${token}' -H 'Accept: application/vnd.github.v3.raw' https://api.github.com/repos/${repo}/tarball/${ref} | tar xz --strip 1`,
    true,
  );

  const hash = hashFiles('package-lock.json', 'yarn.lock');

  const nodeKeys = [
    `node_modules-${platform()}-abi${process.versions.modules}-${await hash}`,
    `node_modules-${platform()}-abi${process.versions.modules}-`,
  ];

  await restore({ path: 'node_modules', keys: nodeKeys });

  // Assume Npm otherwise
  const yarn = await exists('yarn.lock');

  if (yarn) {
    const yarnCache = exec('yarn cache dir');

    const path = (await yarnCache).stdout.slice(0, -1);

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

if (!module.parent) {
  main().then(
    () => console.log('Done with normal execution'),
    e => {
      process.exitCode = 1;
      console.log('Error in run!');
      console.log(e);
    },
  );
}
