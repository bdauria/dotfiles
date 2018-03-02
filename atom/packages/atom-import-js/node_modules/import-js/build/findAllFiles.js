Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = findAllFiles;

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _lastUpdate = require('./lastUpdate');

var _lastUpdate2 = _interopRequireDefault(_lastUpdate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function findAllFiles(workingDirectory, excludes) {
  return new Promise(function (resolve, reject) {
    (0, _glob2['default'])('./**/*.js*', {
      ignore: ['./node_modules/**'].concat(excludes),
      cwd: workingDirectory
    }, function (err, files) {
      if (err) {
        reject(err);
        return;
      }

      Promise.all(files.map(function (pathToFile) {
        return (0, _lastUpdate2['default'])(pathToFile, workingDirectory);
      })).then(resolve);
    });
  });
}
module.exports = exports['default'];