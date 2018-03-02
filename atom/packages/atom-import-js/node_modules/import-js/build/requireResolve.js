Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = requireResolve;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Thin wrapper around `require.resolve()` to avoid errors thrown, and to make
 * it easier to mock in tests.
 */
function requireResolve(absolutePath) {
  if (!_path2['default'].isAbsolute(absolutePath)) {
    throw new Error('Path must be absolute: ' + String(absolutePath));
  }
  try {
    return require.resolve(absolutePath);
  } catch (e) {
    if (/^Cannot find module/.test(e.message)) {
      return absolutePath;
    }
    throw e;
  }
}
module.exports = exports['default'];