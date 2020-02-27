import { input } from './io';
import { getDomains } from './getDomains';

export async function getRuntimeHost(): Promise<string> {
  const runtimeHost = await input('runtime-host-hostname');
  if (runtimeHost) return runtimeHost;

  const domains = await getDomains();

  if (!domains || !domains[0])
    throw new Error('Domains needed if runtime-host-hostname is unset!');

  return domains[0];
}
