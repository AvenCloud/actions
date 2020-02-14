/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * This file takes packages in `src` and compiles them into single files (two if using a post step) and puts them in the `dist` folder along side the required `action.yml`.
 */

import ncc from '@zeit/ncc';

const [binary, script, ...targets] = process.argv;

console.log('Binary:', binary);
console.log('Script:', script);

if (!targets.length) {
  throw new Error('Target missing!');

  // TODO: build them all? Find all `action.yml` and build all those folders?
}

console.log(targets);

async function copyFile(source: string, dest: string): Promise<void> {
  // TODO: implement
}

Promise.all(
  targets.map(async target => {
    console.log(`Building target: ${target}`);

    const mainAndPost = ['main', 'post'] as ['main', 'post'];

    const builds = mainAndPost.map(async mainOrPost => {
      try {
        const { code, map, assets } = await ncc(
          `src/${target}/${mainOrPost}.ts`,
          {
            sourceMap: true,
          },
        );

        // TODO: write code to dist
      } catch (e) {
        if (mainOrPost === 'main') throw e;

        console.log('Error in Post', e);

        if (e.foobar !== 'file missing') throw e;
      }
    });

    const files = [copyFile(`src/${target}/action.yml`, `dist/${target}/`)];

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
