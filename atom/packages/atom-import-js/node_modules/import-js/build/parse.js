Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = parse;
function parse(fileContent) {
  // For some reason, we can't `import` babylon using an es6 import.
  // eslint-disable-next-line global-require
  var babylon = require('babylon');

  return babylon.parse(fileContent, {
    allowImportExportEverywhere: true,
    plugins: ['jsx', 'flow', 'objectRestSpread', 'decorators', 'classProperties', 'exportExtensions', 'dynamicImport'],
    sourceType: 'module'
  });
}
module.exports = exports['default'];