Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = version;

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * @return {String}
 */
function version() {
  return _package2['default'].version;
}

// This gets its own module so that it can be more easily mocked out in tests.

module.exports = exports['default'];