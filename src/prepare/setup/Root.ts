import { ensureFileIs } from '../../utils/Files';
import { request } from '../../utils/request';
import { fixKnownHosts, userHome } from '../../utils/User';
import { join } from 'path';

import { promises } from 'fs';
import { readAvenSecrets } from '../../utils/readSecrets';
const { mkdir } = promises;

export async function fixAuthorizedKeys(
  user: string,
  keySources: string[],
): Promise<void> {
  const userDir = await userHome(user);

  const sshConfDir = join(userDir, '.ssh');

  const { deployPublicKey } = await readAvenSecrets();

  await Promise.all(keySources.map(async (url: string) => await request(url)))
    .then(keys => [...keys, deployPublicKey, '']) // Empty string to ensure file ends in a newline
    .then(keys => keys.join('\n'))
    .then(allKeys =>
      ensureFileIs(join(sshConfDir, 'authorized_keys'), allKeys),
    );
}

/**
 * Configure root user settings.
 *
 * @param {string[]} sources - List of URLs to load developer keys from.
 */
export async function setupRoot(sources?: string[]): Promise<void> {
  const userDir = await userHome('root');

  const sshConfDir = join(userDir, '.ssh');

  await mkdir(sshConfDir, { recursive: true });

  if (!sources) sources = [];

  await Promise.all([
    // Make it easy for root user to clone from github
    fixKnownHosts(userDir),

    fixAuthorizedKeys('root', sources ?? []),
  ]);
}
