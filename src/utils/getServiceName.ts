import { input } from './io';
import { getDomains } from './getDomains';

export async function getServiceName(): Promise<string> {
  return (await input('service-name')) || (await getDomains())[0];
}
