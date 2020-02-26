import { input } from './io';
import { getDomains } from './getDomains';

export async function getRuntimeHost(): Promise<string> {
  return (await input('runtime-host')) || (await getDomains())[0];
}
