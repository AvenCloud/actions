export type Config = {
  /**
   * List of domains to get https keys for.
   */
  domains?: string[];

  /**
   * List of keys to set the root user's authorized keys to.
   */
  authorizedKeys: string[];

  /**
   * Systemd Service configuration.
   */
  service: {
    /**
     * Name of systemd service to use, if not the default as chosen by workflow filename.
     */
    name: string;
    /**
     * Description of systemd service to use. Defaults to "".
     */
    description?: string;
    /**
     * Command used to start the server.
     */
    startServerCommand?: string;

    /**
     * Extra lines to add to service file.
     */
    extraConfigs?: string;
  };

  /**
   * Directory inside built application that should be served as static files by Nginx.
   */
  webRootPath?: string;
  /**
   * Timezone to use.
   *
   * Must be one of "TZ Database Name".
   *
   * @see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
   */
  runtimeServerTimezone?: string;
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
    kibanaHost: string;
    elastic: {
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
    logstashHosts: string[];
  };
};
