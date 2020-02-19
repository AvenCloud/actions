import { input } from '../../utils/inputs';

export async function prepareRemoteServer(): Promise<void> {
  const secrets = input('secrets');

  console.log(secrets);

  // TODO ...
  // copy prepare scripts, aven.json, and generated secrets.json to remote
  // run prepare script on remote
}
