import { join } from 'path';

import { ensureFileContains, mkdir } from './fs';
import { exec } from './spawn';

const userGroups = ['sudo', 'adm', 'systemd-journal'];

const UsernameInUseUserAddExitValue = 9;

export async function userHome(name: string): Promise<string> {
  // TODO: Read from os
  return name === 'root' ? '/root' : `/home/${name}`;
}

/**
 * Create a new user and setup home dir.
 *
 * @param {string} name - Username to make.
 */
export async function createAndConfigureUser(name: string): Promise<void> {
  const command = [];

  // cSpell:ignore useradd
  command.push('useradd');

  // Don't use a group with same name as user (use "users" instead)
  command.push('--no-user-group');
  command.push('--gid', 'users');

  command.push('--shell', '/bin/bash');

  // Create home directory for user
  command.push('--create-home');

  // Default list of groups
  command.push('--groups', userGroups.join(','));

  // Username we're making
  command.push(name);

  await exec(command.join(' ')).catch(e => {
    if (e.code !== UsernameInUseUserAddExitValue) throw e;

    console.log(`User ${name} exists`);

    // cSpell:ignore usermod
    // TODO: `usermod` to make sure user options are consistent (in case they change)
  });

  const home = await userHome(name);

  await mkdir(`${home}/.ssh`);
  await fixKnownHosts(home);
}

export async function ensureKey(user: string, key: string): Promise<void> {
  await ensureFileContains(`${await userHome(user)}/.ssh/authorized_keys`, key);
}

const GitHubKnownHosts =
  'github.com ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAq2A7hRGmdnm9tUDbO9IDSwBK6TbQa+PXYPCPy6rbTrTtw7PHkccKrpp0yVhp5HdEIcKr6pLlVDBfOLX9QUsyCOV0wzfjIJNlGEYsdlLJizHhbn2mUjvSAHQqZETYP81eFzLQNnPHt4EVVUh7VfDESU84KezmD5QlWpXLmvU31/yMf+Se8xhHTvKSCZIFImWwoG6mbUoWf9nzpIoaSjB+weqqUUmpaaasXVal72J+UX2B+2RPW3RcT0eOzQgqlJL3RKrTJvdsjE3JEAvGq3lGHSZXy28G3skua2SmVi/w4yCE6gbODqnTWlg7+wC604ydGXA8VJiS5ap43JXiUFFAaQ==';

export async function fixKnownHosts(userDir: string): Promise<boolean> {
  return ensureFileContains(
    join(userDir, '.ssh', 'known_hosts'),
    GitHubKnownHosts,
  );
}
