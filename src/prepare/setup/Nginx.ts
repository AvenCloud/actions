import {
  ensureFileIs,
  ensureFilesAre,
  ensureLinkIs,
  mkdir,
  chmod,
} from '../../utils/fs';
import { spawn, exec } from '../../utils/spawn';

import { addAptDependencies } from './aptDependencies';
import { readAvenConfig } from '../../utils/readAvenConfig';

addAptDependencies('nginx', 'certbot');

// cSpell:ignore letsencrypt webroot

const certbotWebrootPath = '/var/lib/letsencrypt/webroot';

// Folder containing live certs from letsencrypt
const letsencryptLive = '/etc/letsencrypt/live';

const nginxConf = `user www-data;
worker_processes auto;
pid /run/nginx.pid;

include modules-enabled/*.conf;

events {
    worker_connections 768;
    # multi_accept on;
}

http {
    include conf.d/*.conf;
}
`;

type FileList = { [filename: string]: string };

async function setupNginxSnips(): Promise<void> {
  const dir = '/etc/nginx/snips';

  await mkdir(dir, { recursive: true });

  const snips = {} as FileList;

  snips['force-main-https'] = `location / {
    return 301 https://$server_name$request_uri;
    #rewrite ^ https://$server_name$request_uri? permanent;
}
`;

  snips.letsencrypt = `location ^~ /.well-known/acme-challenge/ {
    default_type "text/plain";
    root ${certbotWebrootPath};
}

location = /.well-known/acme-challenge/ {
    return 404;
}
`;

  // Simplified proxy headers
  snips['proxy-forwarded-headers'] = `proxy_set_header Host $host;
proxy_set_header Forwarded $proxy_add_forwarded;
`;

  // cSpell:ignore SAMEORIGIN

  // Popular forwarded headers
  snips['proxy-headers'] = `proxy_set_header Host $host;
#proxy_set_header Port $server_port;
#proxy_set_header X-Forwarded-Port $server_port;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-Proto $scheme;
#proxy_set_header X-Forwarded-Ssl $https;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
#proxy_set_header X-Frame-Options SAMEORIGIN;
`;

  // Trust Cloudflare to set some headers for us
  snips['trust-cloudflare-ip'] = `set_real_ip_from 103.21.244.0/22;
set_real_ip_from 103.22.200.0/22;
set_real_ip_from 103.31.4.0/22;
set_real_ip_from 104.16.0.0/12;
set_real_ip_from 108.162.192.0/18;
set_real_ip_from 131.0.72.0/22;
set_real_ip_from 141.101.64.0/18;
set_real_ip_from 162.158.0.0/15;
set_real_ip_from 172.64.0.0/13;
set_real_ip_from 173.245.48.0/20;
set_real_ip_from 188.114.96.0/20;
set_real_ip_from 190.93.240.0/20;
set_real_ip_from 197.234.240.0/22;
set_real_ip_from 198.41.128.0/17;
set_real_ip_from 2400:cb00::/32;
set_real_ip_from 2606:4700::/32;
set_real_ip_from 2803:f800::/32;
set_real_ip_from 2405:b500::/32;
set_real_ip_from 2405:8100::/32;
set_real_ip_from 2c0f:f248::/32;
set_real_ip_from 2a06:98c0::/29;

# use any of the following two
real_ip_header CF-Connecting-IP;
#real_ip_header X-Forwarded-For;
`;

  // cSpell:ignore websockets fastcgi

  // Headers needed to enable Web Sockets
  snips['websockets-proxy-headers'] = `proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection $connection_upgrade;
`;

  await Promise.all([
    // let Ubuntu manage this one
    ensureLinkIs('../snippets/fastcgi-php.conf', `${dir}/fastcgi-php.conf`),

    ensureFilesAre(
      Object.entries(snips).map(([config, contents]) => ({
        filename: `${dir}/${config}.conf`,
        contents,
      })),
    ),
  ]);
}

// cSpell:ignore nopush nodelay keepalive sendfile proxied

async function setupNginxConfigs(): Promise<void> {
  const dir = '/etc/nginx/conf.d';

  const { domains } = await readAvenConfig();

  await mkdir(dir, { recursive: true });

  const conf = {} as FileList;

  conf.basic = `sendfile on;
tcp_nopush on;
tcp_nodelay on;
keepalive_timeout 65;
types_hash_max_size 2048;
# server_tokens off;

# server_names_hash_bucket_size 64;
# server_name_in_redirect off;

include /etc/nginx/mime.types;
default_type application/octet-stream;
`;

  conf.gzip = `gzip on;
gzip_disable "msie6";

# gzip_vary on;
# gzip_proxied any;
# gzip_comp_level 6;
# gzip_buffers 16 8k;
# gzip_http_version 1.1;
# gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
`;

  // Allow upgrading http connections. Required for Websockets.
  conf['http-upgrade'] = `map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}
`;

  // Where should we log to
  conf.logging = `access_log /var/log/nginx/access.log;
error_log /var/log/nginx/error.log;
`;

  const validForwardedHeaderPattern =
    '"~^(,[ \\\\t]*)*([!#$%&\'*+.^_`|~0-9A-Za-z-]+=([!#$%&\'*+.^_`|~0-9A-Za-z-]+|\\"([\\\\t \\\\x21\\\\x23-\\\\x5B\\\\x5D-\\\\x7E\\\\x80-\\\\xFF]|\\\\\\\\[\\\\t \\\\x21-\\\\x7E\\\\x80-\\\\xFF])*\\"))?(;([!#$%&\'*+.^_`|~0-9A-Za-z-]+=([!#$%&\'*+.^_`|~0-9A-Za-z-]+|\\"([\\\\t \\\\x21\\\\x23-\\\\x5B\\\\x5D-\\\\x7E\\\\x80-\\\\xFF]|\\\\\\\\[\\\\t \\\\x21-\\\\x7E\\\\x80-\\\\xFF])*\\"))?)*([ \\\\t]*,([ \\\\t]*([!#$%&\'*+.^_`|~0-9A-Za-z-]+=([!#$%&\'*+.^_`|~0-9A-Za-z-]+|\\"([\\\\t \\\\x21\\\\x23-\\\\x5B\\\\x5D-\\\\x7E\\\\x80-\\\\xFF]|\\\\\\\\[\\\\t \\\\x21-\\\\x7E\\\\x80-\\\\xFF])*\\"))?(;([!#$%&\'*+.^_`|~0-9A-Za-z-]+=([!#$%&\'*+.^_`|~0-9A-Za-z-]+|\\"([\\\\t \\\\x21\\\\x23-\\\\x5B\\\\x5D-\\\\x7E\\\\x80-\\\\xFF]|\\\\\\\\[\\\\t \\\\x21-\\\\x7E\\\\x80-\\\\xFF])*\\"))?)*)?)*$"\n';

  //
  conf['proxy-add-forwarded'] = `map $remote_addr $proxy_forwarded_elem {
    # IPv4 addresses can be sent as-is
    ~^[0-9.]+$          "for=$remote_addr";

    # IPv6 addresses need to be bracketed and quoted
    ~^[0-9A-Fa-f:.]+$   "for=\\"[$remote_addr]\\"";

    # Unix domain socket names cannot be represented in RFC 7239 syntax
    default             "for=unknown";
}

map $http_forwarded $proxy_add_forwarded {
    # If the incoming Forwarded header is syntactically valid, append to it
    ${validForwardedHeaderPattern} "$http_forwarded, $proxy_forwarded_elem";

    # Otherwise, replace it
    default "$proxy_forwarded_elem";
}
`;

  // List of nginx server blocks (in files)
  conf.servers = `include servers/*.conf;
`;

  // Default SSL configurations.
  conf.ssl = `##
# SSL Settings
##

# Default keys. Overridden in server configs.
ssl_certificate     ${letsencryptLive}/${domains[0]}/fullchain.pem;
ssl_certificate_key ${letsencryptLive}/${domains[0]}/privkey.pem;


ssl_protocols TLSv1 TLSv1.1 TLSv1.2; # Dropping SSLv3, ref: POODLE
ssl_prefer_server_ciphers on;
`;

  await ensureFilesAre(
    Object.entries(conf).map(([config, contents]) => ({
      filename: `${dir}/${config}.conf`,
      contents,
    })),
  );
}

async function setupNginxBasicServers(): Promise<void> {
  const dir = '/etc/nginx/servers';

  await mkdir(dir, { recursive: true });

  const serverConfigDefault = `server {
      listen 80;
      listen [::]:80;
      listen 443 ssl;
      listen [::]:443 ssl;
  
      include snips/letsencrypt.conf;
  
      location / {
          default_type text/plain;
          return 200 'Nothing to see here...';
      }
  }
  `;

  await ensureFileIs(`${dir}/00_default.conf`, serverConfigDefault);
}

async function setupNginxServersFull(): Promise<void> {
  const { rootPath, domains, serviceName } = await readAvenConfig();

  if (rootPath) await mkdir(rootPath, { recursive: true });

  const upstreamUniqueName = domains[0].replace('.', '_');

  // Name of the socket file used for communications with
  const socketFilename = 'sock';

  // Directory the daemon runs in
  const workingDir = `/run/${serviceName}`;

  // Nginx backend location
  const upstreamHost = `unix:${workingDir}/${socketFilename}`;

  const serverConfig = `server {
    server_name ${domains.join(' ')};
    listen 80 default_server;
    listen [::]:80 default_server;

    include snips/letsencrypt.conf;
    include snips/force-main-https.conf;
}

server {
    server_name ${domains.join(' ')};
    listen 443 ssl default_server;
    listen [::]:443 ssl default_server;

    ssl_certificate     ${letsencryptLive}/${domains[0]}/fullchain.pem;
    ssl_certificate_key ${letsencryptLive}/${domains[0]}/privkey.pem;

    include snips/trust-cloudflare-ip.conf;

    location / ${
      !rootPath
        ? ''
        : `{
      root ${rootPath};
      # If files exist in root, serve them. Otherwise fallback to proxy.
      try_files $uri $uri/index.html @proxyHandler;
    }
    
    location @proxyHandler `
    }{
        include snips/websockets-proxy-headers.conf;
        include snips/proxy-headers.conf;
        proxy_pass http://${upstreamUniqueName};
    }
}

upstream ${upstreamUniqueName} {
    server ${upstreamHost} fail_timeout=0;
}
`;

  await ensureFileIs(`/etc/nginx/servers/${domains[0]}.conf`, serverConfig);
}

const nginxConfigFile = '/etc/nginx/nginx.conf';

async function setupNginxBasic(): Promise<void> {
  await Promise.all([
    ensureFileIs(nginxConfigFile, nginxConf),
    setupNginxSnips(),
    setupNginxConfigs(),
    setupNginxBasicServers(),
  ]);
}

// cSpell:ignore logrotate logrotation

const certbotCliConfig = `authenticator = webroot
webroot-path = ${certbotWebrootPath}

# Because we are using logrotate for greater flexibility, disable the
# internal certbot logrotation.
max-log-backups = 0
`;

const certbotPostRenewNginx = `#!/bin/bash
systemctl reload nginx
`;

// cSpell:ignore YOURDOMAIN privkey fullchain noninteractive

async function setupCertbot(): Promise<void> {
  const { domains } = await readAvenConfig();

  await Promise.all([
    ensureFileIs('/etc/letsencrypt/cli.ini', certbotCliConfig),
    mkdir(certbotWebrootPath, { recursive: true }),
  ]);

  /**
   * Use this for other services that depend on generated keys but require them combined. Like ZNC.
   */
  const outputFile = '/var/lib/znc/znc.pem';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const certbotPostRenewExampleFullChain = `#!/bin/bash
YOURDOMAIN="${domains[0]}"

[[ $RENEWED_LINEAGE != "${letsencryptLive}/$YOURDOMAIN" ]] && exit 0

# Combine certs into single file for some applications that don't support separation
cat ${letsencryptLive}/$YOURDOMAIN/{privkey,fullchain}.pem > ${outputFile}
`;

  // TODO: Support multiple independent domains that serve different websites.

  // Run once for each nginx server. Generates one key pair. Must include all domains that share server.
  await spawn(
    'certbot',

    // cSpell:ignore certonly
    'certonly',

    '--expand',

    '--noninteractive',

    '--agree-tos',

    // Registered e-mail
    '-m',
    // TODO: use better email
    `admin@${domains[0]}`,

    // Add a "--domain" before each domain
    ...domains.reduce<string[]>(
      (res, current) => res.concat('--domain', current),
      [],
    ),
  );

  // Setup hook after getting keys for the first time

  const hook = '/etc/letsencrypt/renewal-hooks/deploy/reload-nginx';
  await ensureFileIs(hook, certbotPostRenewNginx);
  await chmod(hook, 0o755);
}

async function checkNginxConfig(): Promise<void> {
  await spawn('nginx', '-tc', nginxConfigFile);
}

export async function setupNginx(): Promise<void> {
  // Ensure Let's Encrypt configuration is setup
  await setupNginxBasic();

  await checkNginxConfig();

  await exec(`systemctl reload nginx.service`);

  // Before trying to get possibly new keys
  await setupCertbot();

  // Only then do we make sure the rest of the server files are setup
  await setupNginxServersFull();

  await checkNginxConfig();

  await exec(`systemctl reload nginx.service`);
}
