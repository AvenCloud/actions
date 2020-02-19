import { promises } from 'fs';
const { readFile } = promises;

/**
 * Secrets available to prepare script on remote system.
 */
type Secrets = {
  deployPublicKey: string;
};

let secrets: Secrets;

export async function readAvenSecrets(): Promise<Secrets> {
  if (secrets === undefined) {
    const contents = await readFile('secrets.json');

    secrets = JSON.parse(contents.toString());

    // TODO: Sanitize ret object more...
  }

  return secrets;
}
