const { Importer, findProjectRoot } = require('import-js');

const currentFilePath = require('./currentFilePath');

function getImporter() {
  const editor = atom.workspace.getActiveTextEditor();
  const filePath = currentFilePath();
  return new Importer(
    editor.getText().split('\n'),
    filePath,
    findProjectRoot(filePath)
  );
}

module.exports = getImporter;
