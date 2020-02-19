import { promises } from 'fs';
const { mkdir } = promises;

export async function setupPersistentJournal(): Promise<void> {
  await mkdir('/var/log/journal', { recursive: true });
}
