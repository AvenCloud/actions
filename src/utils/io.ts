import { getInput, debug as ghDebug } from '@actions/core';
import { isGitHubAction } from './isGitHubAction';
import { formatWithOptions } from 'util';

export async function input(name: string): Promise<string> {
  if (!isGitHubAction) {
    throw new Error('Not made to work in other environments yet!');
    // TODO: iff not otherwise read from local config, cli arguments, or prompt the dev?
  }

  return getInput(name);
}

export function debug(...info: Parameters<typeof console.log>): void {
  if (isGitHubAction) {
    ghDebug(formatWithOptions({ colors: true }, ...info));
    return;
  }

  if (process.env.DEBUG === undefined) return;

  console.log(...info);
}

export async function verbosityLevel(): Promise<0 | 1 | 2 | 3> {
  const raw = await input('verbosity');

  const level = parseInt(raw);

  if (!isFinite(level)) throw new Error(`Invalid verbosity: ${raw}.`);
  if (level < 0)
    throw new RangeError(`Invalid verbosity: ${level}. 0 is minimum.`);
  if (level > 3)
    throw new RangeError(`Invalid verbosity: ${level}. 3 is maximum.`);

  return level as 0 | 1 | 2 | 3;
}
