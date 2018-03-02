'use strict';

const SelectListView = require('atom-space-pen-views').SelectListView;

const Deferred = require('./Deferred');

// TODO should this use a context menu instead of an overlay at the top of the
// window?
class AskForSelectionView extends SelectListView {
  /**
   * @param {Function} callback
   */
  initialize() {
    super.initialize();
    this.addClass('overlay from-top');
    this.storeFocusedElement();
    this.panel = atom.workspace.addModalPanel({ item: this });
    this.deferred = new Deferred();
    this.show();
  }

  getFilterKey() {
    return 'displayName';
  }

  viewForItem(item) {
    return `<li>${item.displayName}</li>`;
  }

  confirmed(item) {
    this.deferred.resolve(item);
    this.hide();
  }

  show() {
    if (this.panel) {
      this.panel.show();
      this.focusFilterEditor();
    }
  }

  hide() {
    if (this.panel) {
      this.panel.hide();
    }
  }

  cancelled() {
    this.deferred.reject();
    this.hide();
  }

  destroy() {
    this.cancel();
    this.panel.destroy();
  }
}

module.exports = AskForSelectionView;
