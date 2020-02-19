import { promises } from 'fs';
import ncc from '@zeit/ncc';
import { ensureFileIs, ensureFilesAre } from '../utils/Files';

const { mkdir, copyFile } = promises;

export async function buildPrepareScript(): Promise<void> {
  const prepareSrc = `./src/prepare`;

  const prepare = ncc(`${prepareSrc}/index.ts`, {
    sourceMap: true,
    quiet: true,
    minify: true,
    externals: ['./aven.json', './secrets.json'],
    filterAssetBase: './src/',
  });

  const deployDir = `dist/prepare/remote`;

  await mkdir(deployDir, { recursive: true });

  const { code, map, assets } = await prepare;

  await Promise.all([
    copyFile(`${prepareSrc}/setup.sh`, `${deployDir}/setup.sh`),
    ensureFileIs(`${deployDir}/index.js`, code),
    ensureFileIs(`${deployDir}/index.js.map`, map),

    // TODO: Handle permissions and symlinks
    ensureFilesAre(
      Object.keys(assets).map(filename => ({
        filename: `${deployDir}/${filename}`,
        contents: assets[filename].source,
      })),
    ),
  ]);
}
