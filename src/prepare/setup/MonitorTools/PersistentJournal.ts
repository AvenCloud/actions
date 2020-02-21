import { mkdir } from '../../../utils/fs';

export async function setupPersistentJournal(): Promise<void> {
  await mkdir('/var/log/journal');
}
