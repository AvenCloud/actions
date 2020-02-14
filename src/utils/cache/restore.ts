import * as core from '@actions/core';
import * as path from 'path';
import * as cacheHttpClient from './cacheHttpClient';
import { Events, State } from './constants';
import { extractTar } from './tar';
import * as utils from './utils/actionUtils';

async function restore({
  path: cachePath,
  keys,
}: {
  path: string;
  keys: string[];
}): Promise<void> {
  try {
    // Validate inputs, this can cause task failure
    if (!utils.isValidEvent()) {
      utils.logWarning(
        `Event Validation Error: The event type ${
          process.env[Events.Key]
        } is not supported. Only ${utils
          .getSupportedEvents()
          .join(', ')} events are supported at this time.`,
      );
      return;
    }

    core.debug(`Cache Path: ${cachePath}`);

    const primaryKey = keys[0];

    core.saveState(State.CacheKey, primaryKey);

    core.debug('Resolved Keys:');
    core.debug(JSON.stringify(keys));

    if (keys.length > 10) {
      core.setFailed(
        `Key Validation Error: Keys are limited to a maximum of 10.`,
      );
      return;
    }

    for (const key of keys) {
      if (key.length > 512) {
        core.setFailed(
          `Key Validation Error: ${key} cannot be larger than 512 characters.`,
        );
        return;
      }
      const regex = /^[^,]*$/;
      if (!regex.test(key)) {
        core.setFailed(`Key Validation Error: ${key} cannot contain commas.`);
        return;
      }
    }

    try {
      const cacheEntry = await cacheHttpClient.getCacheEntry(keys);
      if (!cacheEntry?.archiveLocation) {
        core.info(`Cache not found for input keys: ${keys.join(', ')}.`);
        return;
      }

      const archivePath = path.join(
        await utils.createTempDirectory(),
        'cache.tgz',
      );
      core.debug(`Archive Path: ${archivePath}`);

      // Store the cache result
      utils.setCacheState(cacheEntry);

      // Download the cache from the cache entry
      await cacheHttpClient.downloadCache(
        cacheEntry.archiveLocation,
        archivePath,
      );

      const archiveFileSize = utils.getArchiveFileSize(archivePath);
      core.info(
        `Cache Size: ~${Math.round(
          archiveFileSize / (1024 * 1024),
        )} MB (${archiveFileSize} B)`,
      );

      await extractTar(archivePath, cachePath);

      const isExactKeyMatch = utils.isExactKeyMatch(primaryKey, cacheEntry);
      utils.setCacheHitOutput(isExactKeyMatch);

      core.info(
        `Cache restored from key: ${cacheEntry && cacheEntry.cacheKey}`,
      );
    } catch (error) {
      utils.logWarning(error.message);
      utils.setCacheHitOutput(false);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

export default restore;
