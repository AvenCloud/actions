import { exec } from '../../utils/spawn';
import { ensureFileIs, mkdir, chmod, chown } from '../../utils/fs';
import { readAvenConfig } from './readAvenConfig';

export async function setupMainServiceFiles(): Promise<void> {
  const config = await readAvenConfig();

  const serviceName = config.serviceName;
  const serviceDescription = config.serviceDescription ?? 'Runtime server';
  const startServerCommand = config.startServerCommand;

  const serviceFile = `/etc/systemd/system/${serviceName}.service`;
  const HomeDir = `/var/lib/${serviceName}`;

  const runtimeUser = 'www-data';
  const runtimeUid = exec(`id -u ${runtimeUser}`);
  const runtimeGid = exec(`id -g ${runtimeUser}`);

  const dir1 = mkdir(`${serviceFile}.d`);
  const dir2 = mkdir(`/opt/aven`);
  const dir3 = mkdir(HomeDir).then(
    async () =>
      await Promise.all([
        chmod(HomeDir, 0o700),
        chown(
          HomeDir,
          Number((await runtimeUid).stdout),
          Number((await runtimeGid).stdout),
        ),
      ]),
  );

  const serviceFileContents = `[Unit]
Description=${serviceDescription}
After=network.target

[Service]
Type=simple
Environment=LISTEN_PATH="/run/${serviceName}/sock"
RuntimeDirectory=${serviceName}
WorkingDirectory=/opt/aven/${serviceName}
ExecStart=${startServerCommand}
Environment=HOME="${HomeDir}"
User=${runtimeUser}

[Install]
WantedBy=default.target
  `;

  await ensureFileIs(serviceFile, serviceFileContents);

  // Tell systemd to read our changes
  await exec(`systemctl daemon-reload`);

  // Run service on server boot
  await exec(`systemctl enable ${serviceName}.service`);

  await Promise.all([dir1, dir2, dir3]);
}
