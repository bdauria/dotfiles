Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = findUsedIdentifiers;

var _visitIdentifierNodes = require('./visitIdentifierNodes');

var _visitIdentifierNodes2 = _interopRequireDefault(_visitIdentifierNodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function findUsedIdentifiers(ast) {
  var result = new Set();
  (0, _visitIdentifierNodes2['default'])(ast.program, function (_ref) {
    var isAssignment = _ref.isAssignment,
        isReference = _ref.isReference,
        isJSX = _ref.isJSX,
        name = _ref.name;

    if (isJSX) {
      result.add('React');
    }
    if (!isReference && !isAssignment) {
      result.add(name);
    }
  });
  return result;
}
module.exports = exports['default'];