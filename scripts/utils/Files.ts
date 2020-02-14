import { promises } from 'fs';

const { readFile, writeFile, symlink, readlink, unlink } = promises;

export async function ensureFileContains(
  filename: string,
  contents: string,
): Promise<boolean> {
  const current = (await readFile(filename).catch(() => '')).toString();

  if (current.includes(contents)) return false;

  await writeFile(filename, current + contents);

  return true;
}

export async function ensureFileIs(
  filename: string,
  contents: string | Buffer,
): Promise<boolean> {
  // We could just skip the read part of this but this preserves modification times
  const current = (await readFile(filename).catch(() => '')).toString();

  if (current === contents) return false;

  await writeFile(filename, contents);

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
): Promise<void> {
  const current = await readlink(path).catch(e => {
    if (e.code === 'ENOENT') return undefined;
    throw e;
  });

  if (target === current) return;

  if (current !== undefined) await unlink(path);

  await symlink(target, path);
}
