import { promises } from 'fs';
import { buildTargetScript, Target } from './targetScript';

const { mkdir, copyFile } = promises;

export async function buildTarget(target: Target): Promise<void> {
  console.log(`Building target: ${target}`);

  const dir = mkdir(`dist/${target}`, { recursive: true });

  const scripts = [
    buildTargetScript(target, 'main'),
    buildTargetScript(target, 'post'),
  ];

  await dir;

  const files = [
    copyFile(`src/actions/${target}/action.yml`, `dist/${target}/action.yml`),
    copyFile(`src/actions/${target}/README.md`, `dist/${target}/README.md`),
  ];

  await Promise.all([...scripts, ...files]);

  console.log(`Done building: ${target}`);
}
