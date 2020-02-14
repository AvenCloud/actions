import { getState, info, debug, getInput } from '@actions/core';
import { join } from 'path';
import { reserveCache, saveCache } from './cacheHttpClient';
import { Events, Inputs, State } from './constants';
import { createTar } from './tar';
import {
  isValidEvent,
  logWarning,
  getSupportedEvents,
  getCacheState,
  isExactKeyMatch,
  resolvePath,
  createTempDirectory,
  getArchiveFileSize,
} from './utils/actionUtils';

async function save(): Promise<void> {
  try {
    if (!isValidEvent()) {
      logWarning(
        `Event Validation Error: The event type ${
          process.env[Events.Key]
        } is not supported. Only ${getSupportedEvents().join(
          ', ',
        )} events are supported at this time.`,
      );
      return;
    }

    const state = getCacheState();

    // Inputs are re-evaluated before the post action, so we want the original key used for restore
    const primaryKey = getState(State.CacheKey);
    if (!primaryKey) {
      logWarning(`Error retrieving key from state.`);
      return;
    }

    if (isExactKeyMatch(primaryKey, state)) {
      info(
        `Cache hit occurred on the primary key ${primaryKey}, not saving cache.`,
      );
      return;
    }

    debug('Reserving Cache');
    const cacheId = await reserveCache(primaryKey);
    if (cacheId === -1) {
      info(
        `Unable to reserve cache with key ${primaryKey}, another job may be creating this cache.`,
      );
      return;
    }
    debug(`Cache ID: ${cacheId}`);
    const cachePath = resolvePath(getInput(Inputs.Path, { required: true }));
    debug(`Cache Path: ${cachePath}`);

    const archivePath = join(await createTempDirectory(), 'cache.tgz');
    debug(`Archive Path: ${archivePath}`);

    await createTar(archivePath, cachePath);

    const fileSizeLimit = 5 * 1024 * 1024 * 1024; // 5GB per repo limit
    const archiveFileSize = getArchiveFileSize(archivePath);
    debug(`File Size: ${archiveFileSize}`);
    if (archiveFileSize > fileSizeLimit) {
      logWarning(
        `Cache size of ~${Math.round(
          archiveFileSize / (1024 * 1024),
        )} MB (${archiveFileSize} B) is over the 5GB limit, not saving cache.`,
      );
      return;
    }

    debug(`Saving Cache (ID: ${cacheId})`);
    await saveCache(cacheId, archivePath);
  } catch (error) {
    logWarning(error.message);
  }
}

export default save;
