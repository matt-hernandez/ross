export function resolveMapGet<U, T>(map: Map<U, T>, key: U, defaultValue: T): T {
  const value = map.get(key);
  return value || defaultValue;
}
