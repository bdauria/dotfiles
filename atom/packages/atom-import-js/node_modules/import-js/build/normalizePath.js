Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = normalizePath;
function normalizePath(rawPath, workingDirectory) {
  if (!rawPath) {
    return './';
  }

  if (rawPath.startsWith(workingDirectory)) {
    return '.' + String(rawPath.slice(workingDirectory.length));
  }

  if (rawPath.startsWith('/')) {
    return '.' + String(rawPath);
  }

  if (rawPath === '.' || rawPath.startsWith('./') || rawPath.startsWith('../')) {
    return rawPath;
  }

  return './' + String(rawPath);
}
module.exports = exports['default'];