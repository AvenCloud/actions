import { ensureLinkIs } from '../../utils/fs';
import { readAvenConfig } from './readAvenConfig';

export async function setupTimezone(): Promise<void> {
  const { runtimeServerTimezone } = await readAvenConfig();

  if (!runtimeServerTimezone) return;

  console.log('Setting timezone to:', runtimeServerTimezone);

  const path = '/etc/localtime';
  const next = `/etc/share/zoneinfo/${runtimeServerTimezone}`;

  await ensureLinkIs(next, path);
}
