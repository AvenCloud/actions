/**
 * This file takes packages in `src` and compiles them into single files (two if using a post step) and puts them in the `dist` folder along side the required `action.yml`.
 */

import ncc from '@zeit/ncc';
import { ensureFileIs, ensureFilesAre } from './utils/Files';
import { promises } from 'fs';

const { mkdir, copyFile } = promises;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const [binary, script, ...targets] = process.argv;

// console.log('Binary:', binary);
// console.log('Script:', script);

if (!targets.length) {
  // TODO: Find all `action.yml` and build all those folders?

  targets.push('checkout');
}

Promise.all(
  targets.map(async target => {
    console.log(`Building target: ${target}`);

    const dir = mkdir(`dist/${target}`, { recursive: true });

    const mainAndPost = ['main', 'post'] as ['main', 'post'];

    const builds = mainAndPost.map(async mainOrPost => {
      try {
        const build = ncc(`./src/${target}/${mainOrPost}.ts`, {
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
      } catch (e) {
        if (mainOrPost === 'main') throw e;

        console.log('Error in Post', e);

        console.log('Maybe ok');
      }
    });

    await dir;

    const files = [
      copyFile(`src/${target}/action.yml`, `dist/${target}/action.yml`),
    ];

    await Promise.all([...builds, ...files]);

    console.log(`Done building: ${target}`);
  }),
).then(
  () => {
    console.log('Done building!');
  },
  e => {
    console.log('Error building!');
    process.exitCode = 1;
    console.log(e);
  },
);
