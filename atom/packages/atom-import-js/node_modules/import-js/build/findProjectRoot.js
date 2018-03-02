Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = findProjectRoot;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var isWinDriveRoot = /^[A-Z]:\\$/;

function findRecursive(directory) {
  if (directory === '/' || isWinDriveRoot.test(directory)) {
    throw new Error('No project root found, looking for a directory with a package.json file.');
  }

  var pathToPackageJson = _path2['default'].join(directory, 'package.json');

  if (_fs2['default'].existsSync(pathToPackageJson)) {
    return directory;
  }

  return findRecursive(_path2['default'].dirname(directory));
}

function makeAbsolute(pathToFile) {
  if (_path2['default'].isAbsolute(pathToFile)) {
    return pathToFile;
  }

  return _path2['default'].join(process.cwd(), pathToFile);
}

function findProjectRoot(pathToFile) {
  return findRecursive(_path2['default'].dirname(makeAbsolute(pathToFile)));
}
module.exports = exports['default'];