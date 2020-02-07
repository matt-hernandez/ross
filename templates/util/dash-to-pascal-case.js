module.exports = function dashToPascalCase(str) {
  const camelCase = str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  return `${camelCase.charAt(0).toUpperCase()}${camelCase.slice(1)}`;
}
