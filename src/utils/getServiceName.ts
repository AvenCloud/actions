import { input } from './io';
import { getDomains } from './getDomains';

export async function getServiceName(): Promise<string> {
  const serviceName = await input('service-name');
  if (serviceName) return serviceName;

  const domains = await getDomains();

  if (!domains || !domains[0])
    throw new Error('Domains needed if service-name is unset!');

  return domains[0];
}
