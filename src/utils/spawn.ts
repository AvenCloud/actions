import {
  spawn as nodeSpawn,
  exec as nodeExec,
  SpawnOptions,
  PromiseWithChild,
} from 'child_process';

import { promisify } from 'util';
import { debug } from './io';

const defaultShell = '/bin/bash';

/**
 * These are functions that run some other program.
 * Each is some combination of these running modes.
 *
 * - Shell                       vs  Command + args
 * - Captured & Buffered output  vs  Stream to stdout/stderr
 * - Promised result/completion  vs  Return Streams.
 */

/**
 * Run a command and send stdout/err to parent's.
 *
 * - Shell
 * - Stream to stdout/stderr
 * - Promised completion (but streams are available on returned object/promise).
 *
 * @param command - Command to run.
 * @param shell - Should we spawn a shell.
 * @param args - Arguments to command.
 */
export function spawn(
  command: string,
  shell: true,
  ...args: string[]
): PromiseWithChild<void>;

/**
 * Run a command and send stdout/err to parent's.
 *
 * - Shell OR Command + args
 * - Stream to stdout/stderr (by default)
 * - Promised completion.
 *
 * @param command - Command to run.
 * @param options - Options to pass to node.spawn.
 * @param args - Arguments to command.
 */
export function spawn(
  command: string,
  options: SpawnOptions,
  ...args: string[]
): PromiseWithChild<void>;

/**
 * Run a command and send stdout/err to parent's.
 *
 * - Command + args
 * - Stream to stdout/stderr
 * - Promised completion.
 *
 * @param command - Command to run.
 * @param args - Arguments to command.
 */
export function spawn(
  command: string,
  ...args: string[]
): PromiseWithChild<void>;

export function spawn(
  command: string,
  first: string | SpawnOptions | true,
  ...args: string[]
): PromiseWithChild<void> {
  const defOpts: SpawnOptions = { stdio: 'inherit' };

  let opts: SpawnOptions;

  if (typeof first === 'string') {
    args.unshift(first);
    opts = defOpts;
  } else {
    if (first === true) {
      opts = { ...defOpts, shell: defaultShell };
    } else {
      opts = { ...defOpts, ...first };
    }
  }

  debug('Spawning', command, args);

  const proc = nodeSpawn(command, args, opts);

  const ret = new Promise((resolve, reject) => {
    proc.on('exit', exitCode => {
      if (exitCode) {
        const e = new Error(`Exit code: ${exitCode}`) as Error & {
          exitCode: number;
        };
        e.exitCode = exitCode;
        reject(e);
      } else {
        resolve();
      }
    });
  }) as PromiseWithChild<void>;

  ret.child = proc;

  return ret;
}

const execP = promisify(nodeExec);

/**
 * Run a command and capture output.
 *
 * Prints nothing.
 *
 * - Shell
 * - Captured & Buffered output
 * - Promised result.
 *
 * @param {string} command - The command to run.
 * @param {true|string} shell - Should we use a shell. Default true.
 * @returns {ChildProcess} The child.
 */
export function exec(
  command: string,
  shell: true | null | string = true,
): PromiseWithChild<{
  stdout: string;
  stderr: string;
}> {
  debug('Exec:', command);

  if (shell === null) {
    return execP(command);
  }

  if (shell === true) shell = defaultShell;

  return execP(command, { shell });
}
