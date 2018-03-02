Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = forwardSlashes;
function forwardSlashes(path) {
  return path.replace(/(^[A-Z]:\\|\\)/g, '/');
}
module.exports = exports['default'];