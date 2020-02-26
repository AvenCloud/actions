import { debug } from '../../utils/io';
import { Config } from '../Config';

let done: (c: Config) => void;

const config: Promise<Config> = new Promise(resolve => {
  done = resolve;
});

let data = '';

process.stdin.on('data', d => {
  data += d;
});

process.stdin.on('end', () => {
  const parsed = JSON.parse(data);

  if (!parsed.domains) {
    throw new Error('`domains` not defined in `aven.json`.');
  }

  if (!Array.isArray(parsed.domains)) {
    throw new Error('`domains` in `aven.json` is not an Array.');
  }

  if (parsed.domains.length < 1) {
    throw new Error('Need at least one domain defined');
  }

  debug('Using aven config:', parsed);

  // TODO: Sanitize object more?

  done(parsed);
});

export function readAvenConfig(): Promise<Config> {
  return config;
}
