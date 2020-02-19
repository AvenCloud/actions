import { ensureFileContains } from '../../utils/Files';
import { setupRoot } from './Root';
import { addAptDependencies } from './aptDependencies';

addAptDependencies('screen', 'git', 'yarn');

export const screenConfig =
  "\ncaption always '%{= dg} %H %{G}| %{B}%l %{G}|%=%?%{d}%-w%?%{r}(%{d}%n %t%? {%u} %?%{r})%{d}%?%+w%?%=%{G}| %{B}%M %d %c:%s '\n";

/**
 * Tools to help developers if they need to connect to server manually.
 */
export async function setupDevTools(): Promise<void> {
  await Promise.all([
    // Handy screen config (multiple tabs)
    ensureFileContains('/etc/screenrc', screenConfig),

    setupRoot(),

    // cSpell:ignore NOPASSWD sudoers

    // ensureFileIs('/etc/sudoers.d/all', `${user} ALL=(ALL) NOPASSWD:ALL\n`),
  ]);
}
