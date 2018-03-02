/**
 * @return String
 */
function currentFilePath() {
  return atom.workspace.getActiveTextEditor().buffer.file.path;
}

module.exports = currentFilePath;
