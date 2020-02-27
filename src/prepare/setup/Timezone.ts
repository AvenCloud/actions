import { ensureLinkIs } from '../../utils/fs';
import { readAvenConfig } from './readAvenConfig';

export async function setupTimezone(): Promise<void> {
  const { timezone } = await readAvenConfig();

  if (!timezone) return;

  const path = '/etc/localtime';
  const next = `/etc/share/zoneinfo/${timezone}`;

  await ensureLinkIs(next, path);
}
