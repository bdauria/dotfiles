Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = initializeModuleFinder;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _Configuration = require('./Configuration');

var _Configuration2 = _interopRequireDefault(_Configuration);

var _ModuleFinder = require('./ModuleFinder');

var _ModuleFinder2 = _interopRequireDefault(_ModuleFinder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var REQUIRED_FILES = ['.importjs.js', 'package.json'];

var alreadyInitializedFinders = new Set();

function checkWorkingDirectory(workingDirectory) {
  return new Promise(function (resolve, reject) {
    if (REQUIRED_FILES.some(function (file) {
      return _fs2['default'].existsSync(_path2['default'].join(workingDirectory, file));
    })) {
      // We're in a good place
      resolve();
      return;
    }

    // It's possible that this folder is the home folder. If we enable the
    // ModuleFinder here, we're going to have too many files to deal with.
    reject(new Error('ModuleFinder is disabled for ' + String(workingDirectory) + ' ' + ('(none of ' + String(REQUIRED_FILES.join(', ')) + ' were found).')));
  });
}

function initializeModuleFinder() {
  var workingDirectory = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : process.cwd();

  var config = new _Configuration2['default']('importjs', workingDirectory);
  var moduleFinder = _ModuleFinder2['default'].getForWorkingDirectory(workingDirectory, {
    excludes: config.get('excludes'),
    ignorePackagePrefixes: config.get('ignorePackagePrefixes')
  });
  if (alreadyInitializedFinders.has(moduleFinder)) {
    return Promise.resolve({});
  }
  alreadyInitializedFinders.add(moduleFinder);
  return new Promise(function (resolve, reject) {
    checkWorkingDirectory(workingDirectory).then(function () {
      return moduleFinder.initializeStorage(config.get('cacheLocation'));
    }).then(function (_ref) {
      var isFreshInstall = _ref.isFreshInstall;
      return moduleFinder.startWatcher().then(function () {
        resolve({ isFreshInstall });
      });
    })['catch'](reject);
  });
}
module.exports = exports['default'];