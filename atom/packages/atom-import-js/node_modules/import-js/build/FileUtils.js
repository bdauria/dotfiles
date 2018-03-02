Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  readJsonFile(absoluteFilePath) {
    if (!_fs2['default'].existsSync(absoluteFilePath)) {
      return null;
    }

    var contents = _fs2['default'].readFileSync(absoluteFilePath, 'utf8');
    if (!contents) {
      // Protect against trying to parse empty files.
      return null;
    }

    return JSON.parse(contents);
  },

  readJsFile(absoluteFilePath) {
    if (!_fs2['default'].existsSync(absoluteFilePath)) {
      return null;
    }

    // Clear the require cache so that the file is read every time.
    delete require.cache[absoluteFilePath];

    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require(absoluteFilePath);
  }
};
module.exports = exports['default'];