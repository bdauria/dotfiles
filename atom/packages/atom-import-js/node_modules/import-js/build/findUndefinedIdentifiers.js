Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = findUndefinedIdentifiers;

var _visitIdentifierNodes = require('./visitIdentifierNodes');

var _visitIdentifierNodes2 = _interopRequireDefault(_visitIdentifierNodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var JSX_BUILT_IN_ELEMENT_PATTERN = /^[a-z]/;

function findUndefinedIdentifiers(ast) {
  var globalVariables = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  var result = [];
  (0, _visitIdentifierNodes2['default'])(ast.program, function (_ref) {
    var isReference = _ref.isReference,
        isJSX = _ref.isJSX,
        name = _ref.name,
        context = _ref.context;

    if (isJSX) {
      result.push({ name: 'React', context }); // Implicit dependency
    }
    if (isReference) {
      return;
    }
    if (isJSX && JSX_BUILT_IN_ELEMENT_PATTERN.test(name)) {
      return;
    }
    result.push({ name, context });
  }, {
    definedInScope: new Set(globalVariables)
  });

  // Filter out those that are defined in the current scope
  var filtered = new Set();
  result.forEach(function (_ref2) {
    var name = _ref2.name,
        context = _ref2.context;

    if (context.definedInScope.has(name)) {
      return;
    }
    filtered.add(name);
  });
  return filtered;
}
module.exports = exports['default'];