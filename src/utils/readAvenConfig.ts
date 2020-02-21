import { promises } from 'fs';
import { debug } from './io';
const { readFile } = promises;

type Config = {
  /**
   * List of domains to get https keys for.
   */
  domains: string[];

  /**
   * Name of systemd service to use, if not the default as chosen by workflow filename.
   */
  serviceName?: string;

  /**
   * Description of systemd service to use. Defaults to "".
   */
  serviceDescription?: string;

  /**
   * Command used to start the server.
   */
  startServerCommand?: string;

  /**
   * Directory inside built application that should be served as static files by Nginx.
   */
  rootPath?: string;

  /**
   * Timezone to use.
   *
   * Must be one of "TZ Database Name".
   *
   * @see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
   */
  timezone?: string;

  /**
   * List of `apt-get` packages to install before running.
   */
  aptDependencies?: string[];

  /**
   * List of `apt-get` packages to install only on runtime server.
   */
  runtimeAptDependencies?: string[];

  journalbeat?: {
    /**
     * Host to use for kibana.
     */
    kibanaHost?: string;

    elastic?: {
      /**
       * Hosts to use for elasticsearch.
       */
      hosts: string[];

      username: string;
      password: string;
    };

    /**
     * Hosts to use for elasticsearch.
     */
    logstashHosts?: string[];
  };
};

let config: Config;

export async function readAvenConfig(): Promise<Config> {
  if (config === undefined) {
    const contents = await readFile('aven.json');

    config = JSON.parse(contents.toString());

    if (!config.domains) {
      throw new Error('`domains` not defined in `aven.json`.');
    }

    if (!Array.isArray(config.domains)) {
      throw new Error('`domains` in `aven.json` is not an Array.');
    }

    if (config.domains.length < 1) {
      throw new Error('Need at least one domain defined');
    }

    // TODO: Sanitize object more...

    debug('Using aven config:', config);
  }

  return config;
}
