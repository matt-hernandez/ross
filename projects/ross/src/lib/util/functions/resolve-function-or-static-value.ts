/**
 * This function checks to see if the first argument is a function. If it is, it passes all of its
 * other arguments to that function. If the first argument is not a function, it simply returns
 * that first argument.
 * @param functionOrStatic - A function or a static value
 * @param args - Any arguments to pass to the first `functionOrStatic` if it is a function.
 */
export function resolveFunctionOrStaticValue(functionOrStatic, ...args): any {
  return typeof functionOrStatic === 'function' ? functionOrStatic(...args) : functionOrStatic;
}
