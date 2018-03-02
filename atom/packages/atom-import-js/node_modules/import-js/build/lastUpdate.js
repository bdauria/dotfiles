Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = lastUpdate;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function lastUpdate(pathToFile, workingDirectory) {
  return new Promise(function (resolve, reject) {
    _fs2['default'].lstat(_path2['default'].join(workingDirectory, pathToFile), function (err, stat) {
      if (err) {
        reject(err);
        return;
      }
      resolve({
        path: pathToFile,
        mtime: stat ? stat.mtime.getTime() : undefined
      });
    });
  });
}

lastUpdate.failSafe = function (pathToFile, workingDirectory) {
  return new Promise(function (resolve) {
    lastUpdate(pathToFile, workingDirectory).then(resolve)['catch'](function () {
      return resolve({
        path: pathToFile,
        mtime: 0
      });
    });
  });
};
module.exports = exports['default'];