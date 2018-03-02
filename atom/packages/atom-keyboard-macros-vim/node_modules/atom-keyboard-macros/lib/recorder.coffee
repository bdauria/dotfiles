{InputTextCommand, DispatchCommand} = require './macro-command'

CommandMode = 0
TextMode = 1
FindAndReplaceMode = 2

module.exports =
class Recorder
  sequence: null
  currentMode: null
  keySeq: null

  constructor: ->
    editor = atom.workspace.getActiveTextEditor()
    @editorElement = atom.views.getView(editor)
    @keySeq = []

  isTextEvent: (e) ->
    stroke = atom.keymaps.keystrokeForKeyboardEvent(e)
    keybind = atom.keymaps.findKeyBindings(keystrokes: stroke, target: @editorElement)
    (keybind.length == 0 and (!e.altKey) and (!e.ctrlKey) and (!e.metaKey)) or stroke == 'tab'

  start: ->
    @sequence = []

  stop: ->
    if @keySeq.length > 0
      e = @keySeq[0]
      if @isTextEvent(e)
        @sequence.push(new InputTextCommand(@keySeq))
      else
        @pushDispatchCommand(@keySeq)

    @keySeq = []
    @currentMode = null

  getSequence: ->
    @sequence

  add: (e) ->
    if(e.keyIdentifier?.match(/Control|Shift|Alt|Meta|Cmd/)) # skip meta keys
      return

    if @isTextEvent(e)
      if @currentMode and @currentMode == TextMode
        @keySeq.push e
      else
        if @keySeq.length > 0
          @keySeq.push e
          [@keySeq, @currentMode] = @pushDispatchCommand(@keySeq)
        else
          @keySeq = [e]
          @currentMode = TextMode

    else # not text event
      if @currentMode == TextMode and @keySeq.length > 0
        #console.log('InputTextCommand', @keySeq)
        @sequence.push(new InputTextCommand(@keySeq))
        @keySeq = []

      @currentMode = CommandMode
      @keySeq.push e
      [@keySeq, @currentMode] = @pushDispatchCommand(@keySeq)


  # for find-and-replace and plugins
  push: (cmd) ->
    if @currentMode == TextMode and @keySeq.length > 0
      @sequence.push(new InputTextCommand(@keySeq))
    else if @currentMode == CommandMode and @keySeq.length > 0
      @pushDispatchCommand(@keySeq)

    @keySeq = []
    @sequence.push cmd
    @currentMode = FindAndReplaceMode

  # Return: [コマンドに解釈できなかった残りのリスト, currentMode]
  pushDispatchCommand: (seq) ->
    keystrokes = ''
    for e in seq
      stroke = atom.keymaps.keystrokeForKeyboardEvent(e)
      if keystrokes.length > 0
        keystrokes = keystrokes + ' ' + stroke
      else
        keystrokes = stroke

      keybind = atom.keymaps.findKeyBindings(keystrokes: keystrokes, target: @editorElement)
      #if keybind.indexOf("vim-mode:insert-after") == 0
      #  console.log('keystrokes', keystrokes, 'keybind', keybind)
      if keybind.length == 0
        continue

      else
        command_name = keybind.command
        unless command_name
          bind = keybind[0]
          command_name = bind.command
        unless command_name.indexOf('atom-keyboard-macros') == 0
          @sequence.push(new DispatchCommand(command_name))

        #console.log('pushDispatchCommand1', command_name, 'TextMode')
        return [[], TextMode]

    #console.log('pushDispatchCommand2', command_name, 'CommandMode')
    [seq, CommandMode]
