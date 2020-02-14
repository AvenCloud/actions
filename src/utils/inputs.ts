export const isGitHubAction = process.env.GITHUB_ACTIONS === 'true';

// TODO:

// iff GH Actions, read inputs using GH Action scripts

// otherwise read from local config, cli arguments, or prompt the dev?
