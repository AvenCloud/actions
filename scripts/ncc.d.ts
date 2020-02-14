/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '@zeit/ncc' {
  type Assets = {
    [filename: string]: { source: string; permissions: string; symlinks: any };
  };
  type Map = any;
  type Code = string;

  /**
   * Options except watch.
   */
  type Options = {
    /**
     * Provide a custom cache path or disable caching.
     */
    cache?: string | false;

    /**
     * Externals to leave as requires of the build.
     */
    externals?: string[];

    /**
     * Directory outside of which never to emit assets.
     *
     * @default process.cwd()
     */
    filterAssetBase?: string;

    /**
     * @default false
     */
    minify?: boolean;

    /**
     * @default false
     */
    sourceMap?: boolean;

    /**
     * Default treats sources as output-relative.
     *
     * @default '../'
     */
    sourceMapBasePrefix?: string;

    /**
     * When outputting a sourcemap, automatically include
     * source-map-support in the output file (increases output by 32kB).
     *
     * @default true
     */
    sourceMapRegister?: boolean;

    /**
     * @default false
     */
    v8cache?: boolean;

    /**
     * @default false
     */
    quiet?: boolean;

    /**
     * @default false
     */
    debugLog?: boolean;
  };

  type Result = { code: Code; map: Map; assets: Assets };

  function ncc(
    input: string,
    options: Options & { watch?: false },
  ): Promise<Result>;

  function ncc(
    input: string,
    options: Options & { watch: true },
  ): {
    /**
     * Handler re-run on each build completion
     * watch errors are reported on "err".
     */
    handler(data: { err: Error } | Result): void;

    /**
     * Handler re-run on each rebuild start.
     */
    rebuild(): void;

    /**
     * Close the watcher.
     */
    close(): void;
  };

  export = ncc;
}
