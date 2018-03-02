Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _requireRelative = require('require-relative');

var _requireRelative2 = _interopRequireDefault(_requireRelative);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _ExportsStorage = require('./ExportsStorage');

var _ExportsStorage2 = _interopRequireDefault(_ExportsStorage);

var _Watcher = require('./Watcher');

var _Watcher2 = _interopRequireDefault(_Watcher);

var _findExports = require('./findExports');

var _findExports2 = _interopRequireDefault(_findExports);

var _findPackageDependencies = require('./findPackageDependencies');

var _findPackageDependencies2 = _interopRequireDefault(_findPackageDependencies);

var _lastUpdate = require('./lastUpdate');

var _lastUpdate2 = _interopRequireDefault(_lastUpdate);

var _readFile = require('./readFile');

var _readFile2 = _interopRequireDefault(_readFile);

var _forwardSlashes = require('./forwardSlashes');

var _forwardSlashes2 = _interopRequireDefault(_forwardSlashes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Checks for package.json or npm-shrinkwrap.json inside a list of files and
 * expands the list of files to include package dependencies if so.
 */
function expandFiles(files, workingDirectory) {
  var promises = [];
  files.forEach(function (file) {
    if (file.path !== './package.json' && file.path !== './npm-shrinkwrap.json') {
      promises.push(Promise.resolve(file));
      return;
    }
    (0, _findPackageDependencies2['default'])(workingDirectory, true).forEach(function (dep) {
      var resolvedPath = void 0;
      try {
        resolvedPath = (0, _forwardSlashes2['default'])(_path2['default'].relative(workingDirectory, _requireRelative2['default'].resolve(dep, workingDirectory)));
        if (!resolvedPath.startsWith('.')) {
          // path.relative won't add "./", but we need it further down the line
          resolvedPath = './' + String(resolvedPath);
        }
      } catch (e) {
        _winston2['default'].error('Failed to resolve "' + String(dep) + '" relative to ' + String(workingDirectory));
        return;
      }

      promises.push(_lastUpdate2['default'].failSafe(resolvedPath, workingDirectory).then(function (_ref) {
        var mtime = _ref.mtime;
        return Promise.resolve({
          path: resolvedPath,
          mtime,
          packageName: dep
        });
      }));
    });
  });
  return Promise.all(promises);
}

function aliasedExportNames(alias, ignorePackagePrefixes) {
  var result = [{ name: alias }];
  ignorePackagePrefixes.forEach(function (prefix) {
    if (alias.startsWith(prefix)) {
      result.push({ name: alias.slice(prefix.length) });
    }
  });
  return result;
}

function defaultExportNames(pathToFile) {
  var parsed = _path2['default'].parse(pathToFile);
  var fileName = parsed.name;
  var dirName = _path2['default'].basename(parsed.dir);

  if (/package\.json|index\.jsx?/.test(parsed.base)) {
    fileName = dirName;
    dirName = _path2['default'].basename(_path2['default'].dirname(parsed.dir));
  }
  if (dirName === '.') {
    return [{
      name: fileName
    }];
  }
  var result = [{
    name: String(dirName) + '-' + String(fileName),
    additional: true
  }, {
    name: fileName
  }];

  if (/e?s$/.test(dirName)) {
    // When the directory has an "s" (or "es") at the end, we assume it's a
    // plural form of something. We then add a third name to the list. As an
    // example, if we have './mocks/ModuleFinder.js' as the pathToFile, we add
    // 'mock-ModuleFinder' here, which will allow the user to find the module
    // with `MockModuleFinder` as the variable name.
    result.push({
      name: String(dirName.replace(/e?s$/, '')) + '-' + String(fileName),
      additional: true
    });
  }
  return result;
}

var instances = {};

var ModuleFinder = function () {
  _createClass(ModuleFinder, null, [{
    key: 'getForWorkingDirectory',

    /**
     * Factory method to get an instance for a specific working directory.
     */
    value: function () {
      function getForWorkingDirectory(workingDirectory, _ref2) {
        var excludes = _ref2.excludes,
            ignorePackagePrefixes = _ref2.ignorePackagePrefixes;

        var instance = instances[workingDirectory];
        if (!instance) {
          instance = new ModuleFinder(workingDirectory, {
            excludes,
            ignorePackagePrefixes
          });
          instances[workingDirectory] = instance;
        }
        return instance;
      }

      return getForWorkingDirectory;
    }()
  }]);

  function ModuleFinder(workingDirectory, _ref3) {
    var excludes = _ref3.excludes,
        ignorePackagePrefixes = _ref3.ignorePackagePrefixes;

    _classCallCheck(this, ModuleFinder);

    this.excludes = excludes;
    this.ignorePackagePrefixes = ignorePackagePrefixes;
    this.workingDirectory = workingDirectory;
    this.storage = new _ExportsStorage2['default']();
    this.watcher = new _Watcher2['default']({
      workingDirectory,
      excludes,
      onFilesAdded: this.handleFilesAdded.bind(this),
      onFilesRemoved: this.handleFilesRemoved.bind(this),
      storage: this.storage
    });
    this.queue = [];
    this.processingQueue = false;
  }

  _createClass(ModuleFinder, [{
    key: 'initializeStorage',
    value: function () {
      function initializeStorage(dbFilename) {
        var _this = this;

        return this.storage.init(dbFilename).then(function (_ref4) {
          var isFreshInstall = _ref4.isFreshInstall;
          return Promise.all(_this.excludes.map(function (glob) {
            return _this.storage.removeAll(glob);
          })).then(function () {
            return _this.storage.purgeDeadNodeModules(_this.workingDirectory);
          }).then(function () {
            return Promise.resolve({ isFreshInstall });
          });
        });
      }

      return initializeStorage;
    }()
  }, {
    key: 'startWatcher',
    value: function () {
      function startWatcher() {
        return this.watcher.initialize();
      }

      return startWatcher;
    }()
  }, {
    key: 'processQueue',
    value: function () {
      function processQueue(done) {
        var _this2 = this;

        var file = this.queue.pop();
        if (!file) {
          this.processingQueue = false;
          _winston2['default'].debug('Queue empty');
          done();
          return;
        }
        var pathToFile = file.path,
            mtime = file.mtime,
            packageName = file.packageName;

        this.processingQueue = true;
        _winston2['default'].debug('Processing ' + String(pathToFile));
        var fullPath = _path2['default'].join(this.workingDirectory, pathToFile);
        (0, _readFile2['default'])(fullPath).then(function (data) {
          var exports = { named: [], typed: [], hasDefault: true };
          try {
            exports = (0, _findExports2['default'])(data, fullPath);
          } catch (e) {
            _winston2['default'].error('Failed to parse ' + String(pathToFile) + ': ' + String(e.message) + '\n' + String(e.stack));
          }
          if (exports.named.length || exports.typed.length || exports.hasDefault) {
            var all = [].concat(_toConsumableArray(exports.named), _toConsumableArray(exports.typed.map(function (t) {
              return 'type ' + String(t);
            })));
            if (exports.hasDefault) {
              all.push('default');
            }
            _winston2['default'].debug('Found exports for ' + String(pathToFile) + ':\n' + String(all.join(', ')));
          } else {
            _winston2['default'].debug('No exports found for ' + String(pathToFile));
          }
          var defaultNames = [];
          if (exports.hasDefault) {
            if (packageName) {
              defaultNames.push.apply(defaultNames, _toConsumableArray(aliasedExportNames(packageName, _this2.ignorePackagePrefixes)));
            } else {
              defaultNames.push.apply(defaultNames, _toConsumableArray(defaultExportNames(pathToFile)));
            }
          }
          _this2.storage.update({
            names: exports.named,
            types: exports.typed,
            defaultNames,
            pathToFile,
            mtime,
            packageName
          }).then(function () {
            _this2.processQueue(done);
          })['catch'](function (error) {
            _winston2['default'].error('Failed to update ' + String(pathToFile) + ' in storage. Reason: ' + String(error.message));
            _this2.processQueue(done);
          });
        })['catch'](function (err) {
          _winston2['default'].error(err.message);
          _this2.processQueue(done);
        });
      }

      return processQueue;
    }()
  }, {
    key: 'handleFilesAdded',
    value: function () {
      function handleFilesAdded(unexpandedFiles) {
        var _this3 = this;

        return new Promise(function (resolve) {
          expandFiles(unexpandedFiles, _this3.workingDirectory).then(function (files) {
            _winston2['default'].debug('Checking ' + String(files.length) + ' files for potential updates');
            _this3.storage.needsUpdate(files).then(function (filesToUpdate) {
              _winston2['default'].debug('Got ' + String(filesToUpdate.length) + ' files to update');
              if (!filesToUpdate.length) {
                resolve();
                return;
              }
              filesToUpdate.forEach(function (file) {
                _this3.queue.unshift(file);
                if (!_this3.processingQueue) {
                  _winston2['default'].debug('Kicking off queue');
                  _this3.processQueue(resolve);
                }
              });
            });
          });
        });
      }

      return handleFilesAdded;
    }()
  }, {
    key: 'handleFilesRemoved',
    value: function () {
      function handleFilesRemoved(files) {
        var _this4 = this;

        if (!files.length) {
          return Promise.resolve();
        }
        _winston2['default'].debug('Removing ' + String(files.length) + ' files');
        var promises = files.map(function (_ref5) {
          var pathToFile = _ref5.path;

          _winston2['default'].debug('Removing ' + String(pathToFile));
          return _this4.storage.remove(pathToFile);
        });
        return Promise.all(promises);
      }

      return handleFilesRemoved;
    }()
  }, {
    key: 'find',
    value: function () {
      function find(variableName) {
        return this.storage.get(variableName);
      }

      return find;
    }()
  }, {
    key: 'search',
    value: function () {
      function search(variableName) {
        return this.storage.search(variableName);
      }

      return search;
    }()
  }]);

  return ModuleFinder;
}();

exports['default'] = ModuleFinder;
module.exports = exports['default'];