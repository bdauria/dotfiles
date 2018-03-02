Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = rerouteConsoleLog;

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Reroutes console logs to winston
 */
function rerouteConsoleLog() {
  /* eslint-disable no-console */
  console.trace = _winston2['default'].trace;
  console.debug = _winston2['default'].debug;
  console.info = _winston2['default'].info;
  console.warn = _winston2['default'].warn;
  console.error = _winston2['default'].error;
  /* eslint-enable no-console */
}
module.exports = exports['default'];