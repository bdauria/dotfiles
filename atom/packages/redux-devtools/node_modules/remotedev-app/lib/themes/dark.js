'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _colors = require('material-ui/styles/colors');

var _colorManipulator = require('material-ui/utils/colorManipulator');

var _spacing = require('material-ui/styles/spacing');

var _spacing2 = _interopRequireDefault(_spacing);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  spacing: _spacing2.default,
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: _colors.blueGrey100,
    primary2Color: _colors.blueGrey400,
    primary3Color: _colors.grey600,
    accent1Color: _colors.blueGrey300,
    accent2Color: _colors.blueGrey400,
    accent3Color: _colors.blueGrey100,
    textColor: _colors.fullWhite,
    alternateTextColor: _colors.fullWhite,
    canvasColor: '#2A2F3A',
    borderColor: (0, _colorManipulator.fade)(_colors.fullWhite, 0.3),
    disabledColor: (0, _colorManipulator.fade)(_colors.fullWhite, 0.3)
  }
};
module.exports = exports['default'];