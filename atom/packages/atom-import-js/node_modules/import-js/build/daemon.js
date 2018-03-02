Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = daemon;

var _readline = require('readline');

var _readline2 = _interopRequireDefault(_readline);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _Importer = require('./Importer');

var _Importer2 = _interopRequireDefault(_Importer);

var _findProjectRoot = require('./findProjectRoot');

var _findProjectRoot2 = _interopRequireDefault(_findProjectRoot);

var _initializeModuleFinder = require('./initializeModuleFinder');

var _initializeModuleFinder2 = _interopRequireDefault(_initializeModuleFinder);

var _version = require('./version');

var _version2 = _interopRequireDefault(_version);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var commandsToFunctionNames = {
  add: 'addImports',
  fix: 'fixImports',
  goto: 'goto',
  rewrite: 'rewriteImports',
  search: 'search',
  word: 'import'
};

function daemon(parentPid, pathToLogFile) {
  process.stdout.write('ImportJS (v' + String((0, _version2['default'])()) + ') DAEMON active. Logs will go to: ' + String(pathToLogFile) + '\n');
  if (parentPid) {
    // Editor plugins should provide a `--parent-pid=<pid>` argument on startup,
    // so that we can check that the daemon process hasn't turned into a zombie
    // once in a while.
    setInterval(function () {
      _winston2['default'].debug('Making sure that the parent process (PID=' + String(parentPid) + ') is still running.');
      try {
        process.kill(parentPid, 0);
      } catch (error) {
        _winston2['default'].info('Parent process seems to have died. Exiting.');
        process.exit(1);
      }
    }, 30000);
  }

  var rlInterface = _readline2['default'].createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  rlInterface.on('line', function (jsonPayload) {
    _winston2['default'].debug('RECEIVED payload: ' + String(jsonPayload));

    var payload = JSON.parse(jsonPayload);

    var workingDirectory = (0, _findProjectRoot2['default'])(payload.pathToFile);
    _winston2['default'].debug('Using ' + String(workingDirectory) + ' as project root for ' + String(payload.pathToFile));

    var importer = new _Importer2['default'](payload.fileContent.split('\n'), payload.pathToFile, workingDirectory);

    var functionName = commandsToFunctionNames[payload.command];
    if (!functionName) {
      var errorString = 'Unknown command: ' + String(payload.command) + '. Valid ones are ' + String(Object.keys(commandsToFunctionNames).join(', '));
      _winston2['default'].error(errorString);
      var jsonResponse = JSON.stringify({ error: errorString });
      process.stdout.write(String(jsonResponse) + '\n');
      return;
    }

    (0, _initializeModuleFinder2['default'])(workingDirectory).then(function (_ref) {
      var isFreshInstall = _ref.isFreshInstall;

      importer[functionName](payload.commandArg).then(function (result) {
        if (isFreshInstall) {
          result.messages.unshift('ImportJS is initializing for ' + String(workingDirectory) + '. Results will be more accurate in a few moments.');
        }
        var jsonResponse = JSON.stringify(result);
        _winston2['default'].debug('SENDING response: ' + String(jsonResponse));
        process.stdout.write(String(jsonResponse) + '\n');
      })['catch'](function (_ref2) {
        var message = _ref2.message,
            stack = _ref2.stack;

        var errorParts = [message];
        if (stack) {
          errorParts.push(stack);
        }
        var jsonResponse = JSON.stringify({
          error: errorParts.join('\n')
        });
        _winston2['default'].error('ERROR response: ' + String(jsonResponse));
        process.stdout.write(String(jsonResponse) + '\n');
      });
    });
  });
}
module.exports = exports['default'];