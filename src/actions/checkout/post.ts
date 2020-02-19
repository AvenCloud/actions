// Other packages https://github.com/actions/toolkit/blob/master/README.md#packages
import save from '../../utils/cache/save';
import { reportError } from '../../utils/reportError';

export async function post(): Promise<void> {
  await save();
}

if (!module.parent) post().catch(reportError);
