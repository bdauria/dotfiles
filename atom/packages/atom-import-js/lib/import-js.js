'use strict';

const withModuleFinder = require('./withModuleFinder');

const CompositeDisposable = require('atom').CompositeDisposable;

const AskForSelectionView = require('./AskForSelectionView');
const getImporter = require('./getImporter');

/**
 * @return {String} The word under the cursor
 */
function getCurrentWord() {
  const editor = atom.workspace.getActiveTextEditor();
  if (!editor) {
    return undefined;
  }

  const cursor = editor.getLastCursor();
  if (!cursor) {
    return undefined;
  }

  const wordRange = cursor.getCurrentWordBufferRange();
  return editor.getTextInBufferRange(wordRange);
}

/**
 * @param {Object} selections
 */
function addImports(selections) {
  getImporter().addImports(selections)
    .then(handleImporterResult) // eslint-disable-line no-use-before-define
    .catch(handleError); // eslint-disable-line no-use-before-define
}

/**
 * @param {Object} unresolvedImports
 */
function askForSelections(unresolvedImports) {
  // Ask for the next selection
  const word = Object.keys(unresolvedImports)[0];
  const alternatives = unresolvedImports[word];
  const remainingUnresolvedImports = unresolvedImports;
  delete remainingUnresolvedImports[word];

  // TODO show what word we are asking for
  const askView = new AskForSelectionView();
  askView.setItems(alternatives);
  askView.show();

  askView.deferred
  .then((resolved) => {
    const add = {};
    add[word] = resolved.data;
    addImports(add);
  })
  // Selection was cancelled, so let's just move on.
  .catch(() => {})
  .then(() => {
    askView.destroy();

    if (Object.keys(remainingUnresolvedImports).length) {
      askForSelections(remainingUnresolvedImports);
    }
  });
}

/**
 * @param {Object} result
 */
function processResultMessages(result) {
  if (result.messages && result.messages.length) {
    // TODO come up with a better solution for this potential wall of text that
    // can happen when fixing a lot of imports.
    atom.notifications.addSuccess(result.messages.join('\n'));
  }
}

/**
 * @param {Object} result
 * @param {Array} result.messages
 * @param {String} result.fileContent
 * @param {Object} result.unresolvedImports
 */
function handleImporterResult(result) {
  const editor = atom.workspace.getActiveTextEditor();
  if (editor.getText() !== result.fileContent) {
    editor.buffer.setTextViaDiff(result.fileContent);
  }

  processResultMessages(result);

  if (Object.keys(result.unresolvedImports).length) {
    askForSelections(result.unresolvedImports, []);
  }
}

/**
 * @param {Object} error
 */
function handleError(error) {
  throw error;
}

function importWord() {
  const word = getCurrentWord();
  if (!word) {
    return;
  }

  withModuleFinder(() => {
    getImporter().import(word)
      .then(handleImporterResult)
      .catch(handleError);
  });
}

function fixImports() {
  withModuleFinder(() => {
    getImporter().fixImports()
      .then(handleImporterResult)
      .catch(handleError);
  });
}

function gotoWord() {
  const word = getCurrentWord();
  if (!word) {
    return;
  }

  withModuleFinder(() => {
    getImporter().goto(word)
      .then((result) => {

        if (result.goto) {
          atom.open({ pathsToOpen: [result.goto], newWindow: false });
        }

        processResultMessages(result);
      })
      .catch(handleError);
  });
}

const ImportJS = {
  subscriptions: null,

  activate() {
    this.subscriptions = new CompositeDisposable;
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'import-js:import': () => importWord(),
      'import-js:goto': () => gotoWord(),
      'import-js:fix-imports': () => fixImports(),
    }));
  },

  /**
   * @return {*}
   */
  deactivate() {
    this.subscriptions.dispose();
  },

  /**
   * @return {Object}
   */
  serialize() {
    return {};
  },
};

module.exports = ImportJS;
