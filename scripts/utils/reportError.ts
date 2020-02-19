export function reportError(e: unknown): void {
  process.exitCode = 1;
  // TODO: Add colors for GH Actions
  console.log('Error in run!');
  console.log(e);
}
