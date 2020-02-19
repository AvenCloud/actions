import { promises } from 'fs';
const { access } = promises;

export async function exists(filePath: string): Promise<boolean> {
  return access(filePath).then(
    () => true,
    () => false,
  );
}
