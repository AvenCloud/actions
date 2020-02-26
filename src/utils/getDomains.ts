import { input } from './io';

export async function getDomains(): Promise<string[]> {
  const raw = await input('domains');

  const domains = raw.split(/\s/).filter(s => s);

  if (!domains.length) {
    throw new Error('`domains` not defined.');
  }

  return domains;
}
