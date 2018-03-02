'use strict';

exports.__esModule = true;
exports.tree = undefined;

var _charts = require('./charts');

Object.defineProperty(exports, 'tree', {
  enumerable: true,
  get: function get() {
    return _charts.tree;
  }
});

var charts = _interopRequireWildcard(_charts);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = charts;