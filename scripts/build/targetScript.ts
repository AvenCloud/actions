import { promises } from 'fs';
import ncc from '@zeit/ncc';
import { ensureFileIs, ensureFilesAre, exists as access } from '../utils/fs';

const { mkdir } = promises;

export type Target = string;

export async function buildTargetScript(
  target: Target,
  mainOrPost: 'main' | 'post',
): Promise<void> {
  const file = `./src/actions/${target}/${mainOrPost}.ts`;

  // TODO: test if yml has post, not mainOrPost
  if (mainOrPost === 'post' && !(await access(file))) return;

  const build = ncc(file, {
    sourceMap: true,
    quiet: true,
    minify: true,
    filterAssetBase: './src/',
  });

  await mkdir(`dist/${target}/${mainOrPost}`, { recursive: true });

  const { code, map, assets } = await build;

  await Promise.all([
    ensureFileIs(`dist/${target}/${mainOrPost}/index.js`, code),
    ensureFileIs(`dist/${target}/${mainOrPost}/index.js.map`, map),

    // TODO: Handle permissions and symlinks
    ensureFilesAre(
      Object.keys(assets).map(filename => ({
        filename: `dist/${target}/${mainOrPost}/${filename}`,
        contents: assets[filename].source,
      })),
    ),
  ]);
}
