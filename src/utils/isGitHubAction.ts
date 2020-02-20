export const isGitHubAction =
  process.env.GITHUB_ACTIONS === 'true' ||
  process.argv.includes('--gh-actions');
