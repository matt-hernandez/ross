export function preventAndReturnNull(predicate) {
  return (target, name, descriptor) => {
    const { value, get } = descriptor;
    const original = value || get;
    function updated(...args) {
      if (predicate(this)) {
        return original.apply(this, args);
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
  };
}
