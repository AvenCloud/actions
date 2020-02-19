import { addAptDependencies } from '../aptDependencies';

addAptDependencies('cockpit');

export async function setupCockpit(): Promise<void> {
  // TODO: Setup user password
  // TODO: configure to work with nginx?
}
