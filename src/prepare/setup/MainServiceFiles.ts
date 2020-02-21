import { exec } from '../../utils/spawn';
import { ensureFileIs, mkdir } from '../../utils/fs';
import { readAvenConfig } from '../../utils/readAvenConfig';

export async function setupMainServiceFiles(): Promise<void> {
  const config = await readAvenConfig();

  const serviceName = config.serviceName ?? config.domains[0];
  const serviceDescription = config.serviceDescription ?? 'Runtime server';
  const startServerCommand = config.startServerCommand ?? '/usr/bin/npm start';

  const serviceFile = `/etc/systemd/system/${serviceName}.service`;

  const dir = mkdir(`${serviceFile}.d`, { recursive: true });

  const serviceFileContents = `[Unit]
  Description=${serviceDescription}
  After=network.target
  
  [Service]
  Type=simple
  Environment=LISTEN_PATH="/run/${serviceName}/sock"
  RuntimeDirectory=${serviceName}
  WorkingDirectory=/opt/${serviceName}
  ExecStart=${startServerCommand}
  User=www-data
  
  [Install]
  WantedBy=default.target
  `;

  await ensureFileIs(serviceFile, serviceFileContents);

  // Tell systemd to read our changes
  await exec(`systemctl daemon-reload`);

  // Run service on server boot
  await exec(`systemctl enable ${serviceName}.service`);

  await dir;
}
