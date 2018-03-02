module.exports =
class OneLineInputView
  callback: null
  element: null
  editorElement: null
  editor: null

  constructor: (serializedState, placeholderText = 'Macro name') ->
    # Create root element
    @element = document.createElement('div')
    @element.classList.add('atom-keyboard-macros')

    @editorElement = document.createElement('atom-text-editor')
    @editor = atom.workspace.buildTextEditor({
      mini: true,
      lineNumberGutterVisible: false,
      placeholderText: placeholderText
    })
    @editorElement.setModel(@editor)
    self = this
    @editorElement.onkeydown = (e) ->
      if e.keyIdentifier == 'Enter'
        value = self.editor.getText()
        self.clearText()
        self.hide()
        self.callback?(value)
    @element.appendChild(@editorElement)

  show: ->
    @panel ?= atom.workspace.addModalPanel(item: @element)
    @panel.show()
    window.addEventListener('keydown', @escapeListener, true)
    @focus()

  hide: ->
    @panel.hide()

  escapeListener: (e) =>
    keystroke = atom.keymaps.keystrokeForKeyboardEvent(e)
    if keystroke == 'escape'
      @hide()
      window.removeEventListener('keydown', @escapeListener, true)

  focus: ->
    @editorElement.focus()

  clearText: ->
    @editor.setText('')

  # Returns an object that can be retrieved when package is activated
  serialize: ->

  # Tear down any state and detach
  destroy: ->
    @element.remove()

  getElement: ->
    @element

  setCallback: (callback) ->
    @callback = callback
