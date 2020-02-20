import { ensureFileContains } from '../../utils/fs';
import { exec } from '../../utils/spawn';

export async function setupSecurity(): Promise<void> {
  // Disable password authentication on sshd
  const changed = await ensureFileContains(
    '/etc/ssh/sshd_config',
    '\nPasswordAuthentication no\n',
  );

  if (changed) {
    await exec('systemctl reload sshd');
  }
}
