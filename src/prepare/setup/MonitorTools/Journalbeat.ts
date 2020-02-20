import { ensureFileIs } from '../../../utils/fs';
import { exec } from '../../../utils/spawn';
import { readAvenConfig } from '../../../utils/readAvenConfig';

export async function setupJournalbeat(): Promise<void> {
  const { journalbeat } = await readAvenConfig();

  if (!journalbeat) return;

  await exec(
    'wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | apt-key add -',
  );

  // Replace list every time
  await ensureFileIs(
    '/etc/apt/sources.list.d/elastic-7.x.list',
    'deb https://artifacts.elastic.co/packages/7.x/apt stable main\n',
  );

  await exec('apt-get update');
  await exec('apt-get install -y journalbeat');

  // TODO: Add to list of apt

  await exec('systemctl enable journalbeat');

  let journalbeatConfig = `journalbeat.inputs:
  - paths: []
    #backoff: 1s
    #max_backoff: 20s
    seek: cursor
    #cursor_seek_fallback: head
    #include_matches: []
    #fields:

  #journalbeat:
    #registry_file: registry

  setup.template.settings:
    index.number_of_shards: 1
    #index.codec: best_compression
    #_source.enabled: false

  #name:
  #tags: ["service-X", "web-tier"]
  #fields:

  #setup.dashboards.enabled: false
  #setup.dashboards.url:

  processors:
    - add_host_metadata: ~
    - add_cloud_metadata: ~  
    - decode_json_fields:
        fields: ["message"]
        process_array: true
        max_depth: 8
        target: ""

  #logging.level: debug
  #logging.selectors: ["*"]

  #monitoring.enabled: false
  #monitoring.cluster_uuid:
  #monitoring.elasticsearch:

  #migration.6_to_7.enabled: true

`;

  if (journalbeat.kibanaHost) {
    journalbeatConfig += `setup.kibana:
  host: "${journalbeat.kibanaHost}"

`;
  }

  if (journalbeat.elastic) {
    journalbeatConfig += `output.elasticsearch:
  hosts: ${JSON.stringify(journalbeat.elastic.hosts)}
  #protocol: "https"
  username: ${JSON.stringify(journalbeat.elastic.username)}
  password: ${JSON.stringify(journalbeat.elastic.password)}

`;
  }

  if (journalbeat.logstashHosts) {
    journalbeatConfig += `output.logstash:
  hosts: ${JSON.stringify(journalbeat.logstashHosts)}
  #ssl.certificate_authorities: ["/etc/pki/root/ca.pem"]
  #ssl.certificate: "/etc/pki/client/cert.pem"
  #ssl.key: "/etc/pki/client/cert.key"

`;
  }

  const change = await ensureFileIs(
    '/etc/journalbeat/journalbeat.yml',
    journalbeatConfig,
  );

  await exec(`systemctl ${change ? 'restart' : 'start'} journalbeat`);
}
