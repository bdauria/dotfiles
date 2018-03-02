Object.defineProperty(exports, "__esModule", {
  value: true
});

var _program$command, _program$command2, _program$command3, _program$command4, _program$command5;

exports['default'] = importjs;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _Configuration = require('./Configuration');

var _Configuration2 = _interopRequireDefault(_Configuration);

var _Importer = require('./Importer');

var _Importer2 = _interopRequireDefault(_Importer);

var _daemon = require('./daemon');

var _daemon2 = _interopRequireDefault(_daemon);

var _findProjectRoot = require('./findProjectRoot');

var _findProjectRoot2 = _interopRequireDefault(_findProjectRoot);

var _initializeLogging = require('./initializeLogging');

var _initializeLogging2 = _interopRequireDefault(_initializeLogging);

var _initializeModuleFinder = require('./initializeModuleFinder');

var _initializeModuleFinder2 = _interopRequireDefault(_initializeModuleFinder);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var pathToLogFile = _path2['default'].join(_os2['default'].tmpdir(), 'importjs.log');
(0, _initializeLogging2['default'])(pathToLogFile);

function stdoutWrite(str) {
  process.stdout.write(String(str) + '\n');
}

function stderrWrite(str) {
  process.stderr.write(String(str) + '\n');
}

/**
 * Grab lines from stdin or directly from the file.
 */
function getLines(pathToFile) {
  return new Promise(function (resolve, reject) {
    if (process.stdin.isTTY) {
      _fs2['default'].readFile(pathToFile, 'utf-8', function (err, fileContent) {
        if (err) {
          reject(err);
          return;
        }
        resolve(fileContent.split('\n'));
      });
      return;
    }
    var parts = [];
    process.stdin.resume();
    process.stdin.setEncoding('utf-8');
    process.stdin.on('data', function (data) {
      parts.push(data);
    });
    process.stdin.on('end', function () {
      resolve(parts.join('').split('\n'));
    });
  });
}

/**
 * Run a command/method on an importer instance
 */
function runCommand(executor, pathToFile, _ref) {
  var overwrite = _ref.overwrite;

  var workingDirectory = (0, _findProjectRoot2['default'])(pathToFile);
  return (0, _initializeModuleFinder2['default'])(workingDirectory).then(function () {
    return getLines(pathToFile).then(function (lines) {
      var importer = new _Importer2['default'](lines, pathToFile, workingDirectory);
      return executor(importer).then(function (result) {
        if (overwrite) {
          _fs2['default'].writeFile(pathToFile, result.fileContent, function (err) {
            if (err) throw err;
            process.exit(0);
          });
        } else {
          stdoutWrite(JSON.stringify(result));
          process.exit(0);
        }
      });
    });
  })['catch'](function (error) {
    stderrWrite(error.message);
    process.exit(1);
  });
}

_commander2['default'].version(_package2['default'].version);

// Some options that are shared by multiple commands
var sharedOptions = {
  overwrite: ['--overwrite', 'overwrite the file with the result after importing']
};

(_program$command = _commander2['default'].command('word <word> <pathToFile>')).option.apply(_program$command, _toConsumableArray(sharedOptions.overwrite)).action(function (word, pathToFile, options) {
  var executor = function executor(importer) {
    return importer['import'](word);
  };
  runCommand(executor, pathToFile, options);
});

(_program$command2 = _commander2['default'].command('search <word> <pathToFile>')).option.apply(_program$command2, _toConsumableArray(sharedOptions.overwrite)).action(function (word, pathToFile, options) {
  var executor = function executor(importer) {
    return importer.search(word).then(function (_ref2) {
      var modules = _ref2.modules;
      return modules;
    });
  };
  runCommand(executor, pathToFile, options);
});

(_program$command3 = _commander2['default'].command('fix <pathToFile>')).option.apply(_program$command3, _toConsumableArray(sharedOptions.overwrite)).action(function (pathToFile, options) {
  var executor = function executor(importer) {
    return importer.fixImports();
  };
  runCommand(executor, pathToFile, options);
});

(_program$command4 = _commander2['default'].command('rewrite <pathToFile>')).option.apply(_program$command4, _toConsumableArray(sharedOptions.overwrite)).action(function (pathToFile, options) {
  var executor = function executor(importer) {
    return importer.rewriteImports();
  };
  runCommand(executor, pathToFile, options);
});

(_program$command5 = _commander2['default'].command('add <imports> <pathToFile>')).option.apply(_program$command5, _toConsumableArray(sharedOptions.overwrite)).action(function (imports, pathToFile, options) {
  var executor = function executor(importer) {
    return importer.addImports(JSON.parse(imports));
  };
  runCommand(executor, pathToFile, options);
});

_commander2['default'].command('goto <word> <pathToFile>').action(function (word, pathToFile) {
  var workingDirectory = (0, _findProjectRoot2['default'])(pathToFile);
  (0, _initializeModuleFinder2['default'])(workingDirectory).then(function () {
    return getLines(pathToFile).then(function (lines) {
      new _Importer2['default'](lines, pathToFile, workingDirectory).goto(word).then(function (result) {
        stdoutWrite(JSON.stringify(result));
        process.exit(0);
      });
    });
  })['catch'](function (error) {
    stderrWrite(error.message);
    process.exit(1);
  });
});

_commander2['default'].command('start').description('start a daemon').option('--parent-pid <n>', parseInt).action(function (_ref3) {
  var parentPid = _ref3.parentPid;

  _initializeLogging2['default'].parentPid = parentPid;
  (0, _daemon2['default'])(parentPid, pathToLogFile);
});

_commander2['default'].command('cachepath').description('show path to cache file').action(function () {
  stdoutWrite(new _Configuration2['default']('importjs').get('cacheLocation'));
});

_commander2['default'].command('logpath').description('show path to log file').action(function () {
  stdoutWrite(pathToLogFile);
});

_commander2['default'].on('--help', function () {
  var examples = ['word someModule path/to/file.js', 'search someModule* path/to/file.js', 'fix path/to/file.js', 'rewrite --overwrite path/to/file.js', 'add \'{ "foo": "path/to/foo", "bar": "path/to/bar" }\' path/to/file.js', 'goto someModule path/to/file.js', 'cachepath', 'logpath', 'start --parent-pid=12345'];

  stdoutWrite('  Examples:');
  stdoutWrite('');
  examples.forEach(function (example) {
    stdoutWrite('    $ importjs ' + String(example));
  });
  stdoutWrite('');
});

function importjs(argv) {
  _commander2['default'].parse(argv);

  if (!argv.slice(2).length) {
    _commander2['default'].outputHelp();
  }
}
module.exports = exports['default'];