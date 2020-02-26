import { setupTimezone } from './Timezone';
import { setupAptDependencies } from './aptDependencies';
import { setupSecurity } from './Security';
import { readAvenConfig } from './readAvenConfig';
import { setAuthorizedKeys } from './Root';

export async function basicServerSetup(): Promise<void> {
  await Promise.all([
    setupSecurity(),

    readAvenConfig()
      .then(c => c.authorizedKeys)
      .then(async keys => {
        if (keys.length) return setAuthorizedKeys('root', keys);
      }),

    setupTimezone(),

    // TODO: hostname, /etc/hosts
  ]);

  await setupAptDependencies();
}
