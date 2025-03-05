import type { Draft, Group } from '../common/types/index.js';

/**
 * Helper for importing `data/{group}-{year}/draft.ts` files to ensure correct paths and types.
 */
export async function importDraftFile(group: Group, year: number): Promise<Draft> {
  // Quirk of vite: it seems to require the original extension for variable dynamic imports
  const teamsFile = (await import(
    `./${group}-${year}/draft.ts`
  )) as typeof import('./women-2025/draft.ts');

  if (!teamsFile.draft) {
    throw new Error('Teams file must export a `draft` object');
  }

  return teamsFile.draft;
}
