import { getInput } from '@actions/core';

export async function input(name: string): Promise<string> {
  return getInput(name);
  // TODO: iff not otherwise read from local config, cli arguments, or prompt the dev?
}
