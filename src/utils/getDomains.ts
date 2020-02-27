import { input } from './io';

export async function getDomains(): Promise<string[] | undefined> {
  const raw = await input('domains');

  if (!raw) return;

  const domains = raw.split(/\s/).filter(s => s);

  if (!domains.length) {
    throw new Error('`domains` not defined.');
  }

  return domains;
}
