export const isGitHubAction =
  process.env.GITHUB_ACTIONS === 'true' || process.argv.find('--gh-actions');
