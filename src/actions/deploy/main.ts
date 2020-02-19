import { prepareRemoteServer } from '../prepare/prepareRemoteServer';
import { reportError } from '../../utils/reportError';

// cSpell:ignore rsync executability

async function copySources(): Promise<void> {
  console.log(
    'TODO: rsync --recursive --links --delete --executability ${{ steps.build.outputs.path }}/ deploy-server:/opt/production',
  );
}
async function restartApplication(): Promise<void> {
  console.log('restart');
  // TODO: ssh deploy-server systemctl stop serviceName
  // TODO: migrate db
  /*
        - name: Test if server needs a restart
        id: reboot
        shell: bash {0}
        run: |
          ssh deploy-server \[ -e /var/run/reboot-required \]
          echo "::set-output name=required::$?"
  */
  // TODO: Restart one way or the other
}

export async function main(): Promise<void> {
  await prepareRemoteServer();

  await copySources();

  await restartApplication();
}

if (!module.parent) main().catch(reportError);
