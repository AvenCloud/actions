import { promises } from 'fs';
const { readFile } = promises;

export async function printOSInfo(): Promise<void> {
  const release = (await readFile('/etc/lsb-release')).toString();

  // cSpell:ignore DISTRIB

  /**
   * Sample /etc/lsb-release:
   * DISTRIB_ID=Ubuntu
   * DISTRIB_RELEASE=18.04
   * DISTRIB_CODENAME=bionic
   * DISTRIB_DESCRIPTION="Ubuntu 18.04.3 LTS".
   */

  // Dirty get OS version
  const osVersion = release
    .split('\n')[3]
    .split('=')[1]
    .split('"')[1];

  console.log('OS Version', osVersion);
}
