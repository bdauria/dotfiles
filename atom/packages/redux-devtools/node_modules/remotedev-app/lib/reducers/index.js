'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = require('redux');

var _socket = require('./socket');

var _socket2 = _interopRequireDefault(_socket);

var _monitor = require('./monitor');

var _monitor2 = _interopRequireDefault(_monitor);

var _notification = require('./notification');

var _notification2 = _interopRequireDefault(_notification);

var _instances = require('./instances');

var _instances2 = _interopRequireDefault(_instances);

var _test = require('./test');

var _test2 = _interopRequireDefault(_test);

var _reports = require('./reports');

var _reports2 = _interopRequireDefault(_reports);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rootReducer = (0, _redux.combineReducers)({
  socket: _socket2.default,
  monitor: _monitor2.default,
  instances: _instances2.default,
  test: _test2.default,
  reports: _reports2.default,
  notification: _notification2.default
});

exports.default = rootReducer;
module.exports = exports['default'];