Object.defineProperty(exports, "__esModule", {
  value: true
});

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _Configuration = require('./Configuration');

var _Configuration2 = _interopRequireDefault(_Configuration);

var _rerouteConsoleLog = require('./rerouteConsoleLog');

var _rerouteConsoleLog2 = _interopRequireDefault(_rerouteConsoleLog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function initializeLogging(pathToLogFile) {
  // The `importjs` here is mostly a dummy file because config relies on a
  // `pathToCurrentFile`. Normally, this is the javascript file you are
  // editing.
  var level = new _Configuration2['default']('importjs').get('logLevel');
  _winston2['default'].configure({
    level,
    transports: [new _winston2['default'].transports.File({
      filename: pathToLogFile,

      json: false,

      timestamp() {
        return Date.now();
      },

      formatter(_ref) {
        var timestamp = _ref.timestamp,
            level = _ref.level,
            message = _ref.message;

        var parts = [timestamp(), level.toUpperCase()];
        if (initializeLogging.parentPid) {
          // This gets set when run as a daemon
          parts.push('PID:' + String(initializeLogging.parentPid));
        }
        parts.push(message);
        return parts.join(' ');
      }
    })]
  });
  (0, _rerouteConsoleLog2['default'])();
}

exports['default'] = initializeLogging;
module.exports = exports['default'];