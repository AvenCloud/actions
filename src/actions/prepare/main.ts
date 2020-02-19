import { prepareRemoteServer } from './prepareRemoteServer';
import { reportError } from '../../utils/reportError';

export async function main(): Promise<void> {
  await prepareRemoteServer();
}

if (!module.parent) main().catch(reportError);
