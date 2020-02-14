export async function wait(milliseconds: number): Promise<void> {
  if (isNaN(milliseconds)) throw new Error('milliseconds not a number');
  if (milliseconds < 0) throw new RangeError('Cannot use negative numbers');

  return new Promise(resolve => setTimeout(resolve, milliseconds));
}
