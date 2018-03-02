Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = resolveImportPathAndMain;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _escapeRegExp = require('lodash/escapeRegExp');

var _escapeRegExp2 = _interopRequireDefault(_escapeRegExp);

var _FileUtils = require('./FileUtils');

var _FileUtils2 = _interopRequireDefault(_FileUtils);

var _forwardSlashes = require('./forwardSlashes');

var _forwardSlashes2 = _interopRequireDefault(_forwardSlashes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function findIndex(directory) {
  return ['index.js', 'index.jsx'].find(function (indexFile) {
    return _fs2['default'].existsSync(_path2['default'].join(directory, indexFile));
  });
}


function resolveForPackage(filePath, workingDirectory) {
  if (!filePath.endsWith('/package.json')) {
    return null;
  }

  var json = _FileUtils2['default'].readJsonFile(_path2['default'].join(workingDirectory, filePath));
  if (!json) {
    return [null, null];
  }

  var mainFile = json.main;
  var match = filePath.match(/(.*)[\\/]package\.json/);
  if (!match) {
    return [null, null];
  }

  var matchPackage = match[1];

  if (!mainFile) {
    var indexFile = findIndex(_path2['default'].join(workingDirectory, matchPackage));
    if (!indexFile) {
      return [null, null];
    }
    mainFile = indexFile;
  }

  var mainFilePath = _path2['default'].join(workingDirectory, matchPackage, mainFile);
  if (_fs2['default'].existsSync(mainFilePath) && _fs2['default'].lstatSync(mainFilePath).isDirectory()) {
    // The main in package.json refers to a directory, so we want to
    // resolve it to an index file.
    var _indexFile = findIndex(mainFilePath);
    if (_indexFile) {
      mainFile += '/' + String(_indexFile);
    }
  }

  return [matchPackage, (0, _forwardSlashes2['default'])(_path2['default'].normalize(mainFile))];
}

function resolveImportPathAndMain(filePath, stripFileExtensions) {
  var workingDirectory = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : process.cwd();

  var resolvedForPackage = resolveForPackage(filePath, workingDirectory);
  if (resolvedForPackage) {
    return resolvedForPackage;
  }

  var match = filePath.match(/(.*)\/(index\.js[^/]*)$/);
  if (match) {
    return [match[1], match[2]];
  }

  if (!stripFileExtensions) {
    return [filePath, null];
  }

  var extensions = stripFileExtensions.map(function (ext) {
    return (0, _escapeRegExp2['default'])(ext);
  });
  var importPath = filePath.replace(RegExp('(' + String(extensions.join('|')) + ')$'), '');
  return [importPath, null];
}
module.exports = exports['default'];