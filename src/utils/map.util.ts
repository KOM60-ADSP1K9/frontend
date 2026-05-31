export function buildIdNameMap<T extends { id: string; name: string }>(items: T[]): Record<string, string> {
  const map: Record<string, string> = {};
  items.forEach((item) => { map[item.id] = item.name; });
  return map;
}
