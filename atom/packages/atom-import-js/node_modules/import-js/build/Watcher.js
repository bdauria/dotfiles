Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fbWatchman = require('fb-watchman');

var _fbWatchman2 = _interopRequireDefault(_fbWatchman);

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _ExportsStorage = require('./ExportsStorage');

var _ExportsStorage2 = _interopRequireDefault(_ExportsStorage);

var _findAllFiles = require('./findAllFiles');

var _findAllFiles2 = _interopRequireDefault(_findAllFiles);

var _normalizePath = require('./normalizePath');

var _normalizePath2 = _interopRequireDefault(_normalizePath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SUBSCRIPTION_NAME = 'import-js-subscription';

var Watcher = function () {
  function Watcher(_ref) {
    var _ref$workingDirectory = _ref.workingDirectory,
        workingDirectory = _ref$workingDirectory === undefined ? process.cwd() : _ref$workingDirectory,
        _ref$excludes = _ref.excludes,
        excludes = _ref$excludes === undefined ? [] : _ref$excludes,
        _ref$onFilesAdded = _ref.onFilesAdded,
        onFilesAdded = _ref$onFilesAdded === undefined ? function () {
      return Promise.resolve();
    } : _ref$onFilesAdded,
        _ref$onFilesRemoved = _ref.onFilesRemoved,
        onFilesRemoved = _ref$onFilesRemoved === undefined ? function () {
      return Promise.resolve();
    } : _ref$onFilesRemoved,
        storage = _ref.storage;

    _classCallCheck(this, Watcher);

    // eslint-disable-line object-curly-newline
    this.workingDirectory = workingDirectory;
    this.excludes = excludes;
    this.onFilesAdded = onFilesAdded;
    this.onFilesRemoved = onFilesRemoved;
    this.storage = storage;
  }

  _createClass(Watcher, [{
    key: 'subscribe',
    value: function () {
      function subscribe(_ref2) {
        var _this = this;

        var client = _ref2.client,
            fbWatch = _ref2.fbWatch,
            relativePath = _ref2.relativePath;

        var subscription = {
          // Match javascript files
          expression: ['anyof', ['suffix', 'js'], ['suffix', 'jsx'], ['suffix', 'json']],
          fields: ['name', 'exists', 'mtime_ms'],
          relative_root: relativePath
        };

        return new Promise(function (resolve, reject) {
          client.command(['subscribe', fbWatch, SUBSCRIPTION_NAME, subscription], function (error) {
            if (error) {
              reject(error);
              return;
            }
            resolve();
          });

          client.on('subscription', function (resp) {
            if (resp.subscription !== SUBSCRIPTION_NAME) {
              return;
            }

            var added = [];
            var removed = [];
            resp.files.forEach(function (file) {
              var normalizedPath = (0, _normalizePath2['default'])(file.name, _this.workingDirectory);
              if (normalizedPath.indexOf('/node_modules/') !== -1) {
                return;
              }
              if (_this.excludes.some(function (pattern) {
                return (0, _minimatch2['default'])(normalizedPath, pattern);
              })) {
                return;
              }
              if (file.exists) {
                added.push({ path: normalizedPath, mtime: +file.mtime_ms });
              } else {
                removed.push({ path: normalizedPath });
              }
            });
            if (added.length) {
              _this.onFilesAdded(added);
            }
            if (removed.length) {
              _this.onFilesRemoved(removed);
            }
          });
        });
      }

      return subscribe;
    }()
  }, {
    key: 'startSubscription',
    value: function () {
      function startSubscription(_ref3) {
        var _this2 = this;

        var client = _ref3.client;

        return new Promise(function (resolve, reject) {
          client.command(['watch-project', _this2.workingDirectory], function (error, resp) {
            if (error) {
              reject(error);
              return;
            }

            if ('warning' in resp) {
              _winston2['default'].warn('WARNING received during watchman init: ' + String(resp.warning));
            }

            _this2.subscribe({
              client,
              fbWatch: resp.watch,
              relativePath: resp.relative_path
            }).then(resolve)['catch'](reject);
          });
        });
      }

      return startSubscription;
    }()
  }, {
    key: 'initialize',
    value: function () {
      function initialize() {
        var _this3 = this;

        return new Promise(function (resolve, reject) {
          _this3.initializeWatchman().then(resolve)['catch'](function (error) {
            _winston2['default'].warn('\n          Couldn\'t initialize the Watchman watcher. This is most likely because\n          you don\'t have Watchman installed. Follow instructions here if you\n          want to rid this warning:\n          https://facebook.github.io/watchman/docs/install.html\n\n          ImportJS will fall back to polling instead. This is slower, and more\n          resource-heavy. Plus, changes will not be immediately available.\n          \n\n          Reason: ' + String(error.message) + '\n' + String(error.stack) + '\n        ');
            _this3.initializePolling().then(resolve)['catch'](reject);
          });
        });
      }

      return initialize;
    }()

    /**
     * Get all files from the watchman-powered cache. Returns a promise that will
     * resolve if watchman is available, and the file cache is enabled. Will
     * resolve immediately if previously initialized.
     */

  }, {
    key: 'initializeWatchman',
    value: function () {
      function initializeWatchman() {
        var _this4 = this;

        return new Promise(function (resolve, reject) {
          var client = new _fbWatchman2['default'].Client();
          client.on('error', function (error) {
            reject(error);
          });
          client.capabilityCheck({
            optional: [],
            required: ['relative_root']
          }, function (error) {
            if (error) {
              client.end();
              reject(error);
            } else {
              _this4.startSubscription({ client }).then(resolve)['catch'](reject);
            }
          });
        });
      }

      return initializeWatchman;
    }()
  }, {
    key: 'initializePolling',
    value: function () {
      function initializePolling() {
        var _this5 = this;

        setInterval(function () {
          _this5.poll();
        }, 30000);
        return this.poll();
      }

      return initializePolling;
    }()
  }, {
    key: 'poll',
    value: function () {
      function poll() {
        var _this6 = this;

        return new Promise(function (resolve, reject) {
          (0, _findAllFiles2['default'])(_this6.workingDirectory, _this6.excludes).then(function (files) {
            var mtimes = {};
            files.forEach(function (_ref4) {
              var pathToFile = _ref4.path,
                  mtime = _ref4.mtime;

              mtimes[pathToFile] = mtime;
            });
            _this6.storage.allFiles().then(function (storedFiles) {
              var removedFiles = [];
              storedFiles.forEach(function (storedFile) {
                if (storedFile.startsWith('./node_modules/')) {
                  // Ignore this file, as it won't be in the list of all files (we
                  // exclude node_modules by default).
                  return;
                }
                var mtime = mtimes[storedFile];
                if (!mtime) {
                  removedFiles.push({ path: storedFile });
                }
              });
              _this6.onFilesAdded(files).then(function () {
                return _this6.onFilesRemoved(removedFiles);
              }).then(resolve)['catch'](reject);
            });
          })['catch'](reject);
        });
      }

      return poll;
    }()
  }]);

  return Watcher;
}();

exports['default'] = Watcher;
module.exports = exports['default'];