import { getInput } from '@actions/core';
import { isGitHubAction } from './isGitHubAction';

export async function input(name: string): Promise<string> {
  if (!isGitHubAction) {
    throw new Error('Not made to work in other environments yet!');
    // TODO: iff not otherwise read from local config, cli arguments, or prompt the dev?
  }

  return getInput(name);
}
