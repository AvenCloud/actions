import { promises as fs, PathLike } from 'fs';
import { debug } from './io';

export async function chmod(
  ...args: Parameters<typeof fs.chmod>
): Promise<void> {
  const [path, value] = args;

  debug('chmod:', path, 'to', value);

  await fs.chmod(...args);
}

export async function copyFile(
  ...args: Parameters<typeof fs.copyFile>
): Promise<void> {
  const [src, dest] = args;

  debug('copyFile:', src, 'to', dest);

  await fs.copyFile(...args);
}

export async function mkdir(
  dir: PathLike,
  options?: Parameters<typeof fs.mkdir>['1'],
): Promise<void> {
  if (typeof options !== 'object') {
    options = { mode: options as number };
  }

  options = { recursive: true, ...options };

  debug('mkdir:', dir);

  await fs.mkdir(dir, options);
}

export async function exists(filePath: string): Promise<boolean> {
  return fs.access(filePath).then(
    () => true,
    () => false,
  );
}

export async function ensureFileContains(
  filename: string,
  contents: string,
): Promise<boolean> {
  const current = (await fs.readFile(filename).catch(() => '')).toString();

  if (current.includes(contents)) return false;

  debug('Appending to file:', filename, 'bytes:', contents.length);

  await fs.writeFile(filename, current + contents);

  return true;
}

export async function ensureFileIs(
  filename: string,
  contents: string | Buffer,
  mode?: number,
): Promise<boolean> {
  // We could just skip the read part of this but this preserves modification times
  const current = (await fs.readFile(filename).catch(() => '')).toString();

  if (current === contents) return false;

  debug('Writing to file:', filename, 'bytes:', contents.length);

  await fs.writeFile(filename, contents, { mode });

  return true;
}

export async function ensureFilesAre(
  list: {
    filename: string;
    contents: string | Buffer;
  }[],
): Promise<void> {
  await Promise.all(
    list.map(({ filename, contents }) => ensureFileIs(filename, contents)),
  );
}

export async function ensureLinkIs(
  target: string,
  path: string,
): Promise<boolean> {
  const current = await fs.readlink(path).catch(e => {
    if (e.code === 'ENOENT') return undefined;
    throw e;
  });

  if (target === current) return false;

  if (current !== undefined) await fs.unlink(path);

  debug('Updating symlink', path, 'to point to', target);

  await fs.symlink(target, path);

  return true;
}
