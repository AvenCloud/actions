import { saveState, info, debug, setFailed } from '@actions/core';
import { join } from 'path';
import { getCacheEntry, downloadCache } from './cacheHttpClient';
import { Events, State } from './constants';
import { extractTar } from './tar';
import {
  isValidEvent,
  logWarning,
  getSupportedEvents,
  createTempDirectory,
  setCacheState,
  getArchiveFileSize,
  isExactKeyMatch,
  setCacheHitOutput,
} from './utils/actionUtils';

async function restore({
  path: cachePath,
  keys,
}: {
  path: string;
  keys: string[];
}): Promise<void> {
  try {
    // Validate inputs, this can cause task failure
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

    debug(`Cache Path: ${cachePath}`);

    const primaryKey = keys[0];

    saveState(State.CacheKey, primaryKey);

    debug('Resolved Keys:');
    debug(JSON.stringify(keys));

    if (keys.length > 10) {
      setFailed(`Key Validation Error: Keys are limited to a maximum of 10.`);
      return;
    }

    for (const key of keys) {
      if (key.length > 512) {
        setFailed(
          `Key Validation Error: ${key} cannot be larger than 512 characters.`,
        );
        return;
      }
      const regex = /^[^,]*$/;
      if (!regex.test(key)) {
        setFailed(`Key Validation Error: ${key} cannot contain commas.`);
        return;
      }
    }

    try {
      const cacheEntry = await getCacheEntry(keys);
      if (!cacheEntry?.archiveLocation) {
        info(`Cache not found for input keys: ${keys.join(', ')}.`);
        return;
      }

      const archivePath = join(await createTempDirectory(), 'cache.tgz');
      debug(`Archive Path: ${archivePath}`);

      // Store the cache result
      setCacheState(cacheEntry);

      // Download the cache from the cache entry
      await downloadCache(cacheEntry.archiveLocation, archivePath);

      const archiveFileSize = getArchiveFileSize(archivePath);
      info(
        `Cache Size: ~${Math.round(
          archiveFileSize / (1024 * 1024),
        )} MB (${archiveFileSize} B)`,
      );

      await extractTar(archivePath, cachePath);

      const isExactKeyMatchRes = isExactKeyMatch(primaryKey, cacheEntry);
      setCacheHitOutput(isExactKeyMatchRes);

      info(`Cache restored from key: ${cacheEntry && cacheEntry.cacheKey}`);
    } catch (error) {
      logWarning(error.message);
      setCacheHitOutput(false);
    }
  } catch (error) {
    setFailed(error.message);
  }
}

export default restore;
