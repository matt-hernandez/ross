export function onlyForAnimation(target, name, descriptor) {
  const { value, get } = descriptor;
  const original = value || get;
  function updated(...args) {
    if (this.animate || this.group.animate) {
      return original.apply(this, ...args);
    }
    return null;
  }
  if (value) {
    descriptor.value = updated;
  }
  if (get) {
    descriptor.get = updated;
  }
  return descriptor;
}
