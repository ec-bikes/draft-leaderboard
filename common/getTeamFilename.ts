/** Get the team filename (no .json or path) from the owner name */
export function getTeamFilename(owner: string): string {
  return owner.split(' ')[0].toLowerCase();
}
