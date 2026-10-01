/* Monitor groups shared by the status hero map and the service table. */
export const groupOrder = ['USA infrastructure', 'EU infrastructure', 'Platform services'];

export function groupName(region: string): string {
  if (region.startsWith('USA')) {
    return 'USA infrastructure';
  }
  if (region.startsWith('EU')) {
    return 'EU infrastructure';
  }
  return 'Platform services';
}
