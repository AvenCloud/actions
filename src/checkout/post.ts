// Other packages https://github.com/actions/toolkit/blob/master/README.md#packages
import save from '../utils/cache/save';

export async function post(): Promise<void> {
  await save();
}

if (!module.parent) {
  post().then(
    () => console.log('Done with normal execution'),
    e => {
      process.exitCode = 1;
      console.log('Error in run!');
      console.log(e);
    },
  );
}
