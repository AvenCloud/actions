declare module 'yarn-or-npm' {
  export function hasNpm(): boolean;

  export function hasYarn(): boolean;

  export function clearCache(): void;

  interface YarnOrNpm {
    (): 'yarn' | 'npm';

    hasNpm: typeof hasNpm;
    hasYarn: typeof hasYarn;
    clearCache: typeof clearCache;
  }

  const yarnOrNpm: YarnOrNpm;

  export default yarnOrNpm;
}
