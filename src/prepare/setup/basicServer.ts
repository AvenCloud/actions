import { setupTimezone } from './Timezone';
import { setupAptDependencies } from './aptDependencies';
import { setupSecurity } from './Security';

export async function basicServerSetup(): Promise<void> {
  await setupSecurity();

  await setupTimezone();

  // TODO: hostname, /etc/hosts

  await setupAptDependencies();
}
