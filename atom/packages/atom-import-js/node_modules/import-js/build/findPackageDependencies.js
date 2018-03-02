Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = findPackageDependencies;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _FileUtils = require('./FileUtils');

var _FileUtils2 = _interopRequireDefault(_FileUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Finds dependencies from package.json
 */
function findPackageDependencies(workingDirectory, includeDevDependencies) {
  var packageJson = _FileUtils2['default'].readJsonFile(_path2['default'].join(workingDirectory, 'package.json'));
  if (!packageJson) {
    return new Set([]);
  }

  var keys = ['dependencies', 'peerDependencies'];
  if (includeDevDependencies) {
    keys.push('devDependencies');
  }
  var result = new Set();
  keys.forEach(function (key) {
    if (Object.prototype.hasOwnProperty.call(packageJson, key)) {
      Object.keys(packageJson[key]).forEach(function (packageName) {
        result.add(packageName);
      });
    }
  });
  return result;
}
module.exports = exports['default'];