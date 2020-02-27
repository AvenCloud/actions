import { ensureFileIs, mkdir } from '../../utils/fs';
import { fixKnownHosts, userHome } from '../../utils/User';
import { join } from 'path';

export async function setAuthorizedKeys(
  user: string,
  keys: string[],
): Promise<void> {
  const userDir = await userHome(user);

  const sshConfDir = join(userDir, '.ssh');

  await mkdir(sshConfDir);

  await ensureFileIs(
    join(sshConfDir, 'authorized_keys'),
    [...keys, ''].join('\n'),
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

  await mkdir(sshConfDir);

  if (!sources) sources = [];

  await Promise.all([
    // Make it easy for root user to clone from github
    fixKnownHosts(userDir),

    setAuthorizedKeys('root', sources ?? []),
  ]);
}
