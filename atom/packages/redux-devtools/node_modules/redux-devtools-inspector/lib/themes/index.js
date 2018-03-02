'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _inspector = require('./inspector');

Object.defineProperty(exports, 'inspector', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_inspector).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }