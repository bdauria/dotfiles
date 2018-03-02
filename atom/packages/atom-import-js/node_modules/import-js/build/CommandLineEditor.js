Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CommandLineEditor = function () {
  function CommandLineEditor(lines) {
    _classCallCheck(this, CommandLineEditor);

    this._lines = lines;
  }

  _createClass(CommandLineEditor, [{
    key: 'currentFileContent',
    value: function () {
      function currentFileContent() {
        return this._lines.join('\n');
      }

      return currentFileContent;
    }()
  }, {
    key: 'get',
    value: function () {
      function get(index) {
        return this._lines[index];
      }

      return get;
    }()
  }, {
    key: 'remove',
    value: function () {
      function remove(index) {
        this._lines.splice(index, 1);
      }

      return remove;
    }()

    /**
     * Insert a line above the specified index
     */

  }, {
    key: 'insertBefore',
    value: function () {
      function insertBefore(index, str) {
        this._lines.splice(index, 0, str);
      }

      return insertBefore;
    }()
  }]);

  return CommandLineEditor;
}();

exports['default'] = CommandLineEditor;
module.exports = exports['default'];