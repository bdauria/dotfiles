AtomKeyboardMacrosView = require './atom-keyboard-macros-view'
{CompositeDisposable} = require 'atom'
{keystrokeForKeyboardEvent, keydownEvent, characterForKeyboardEvent} = require './helpers'

class MacroCommand
  @viewInitialized: false
  @findViewInitialized: false

  @resetForToString: ->
    MacroCommand.viewInitialized = false

  # override this method
  execute: ->

  # override this method
  toString: ->

  # override this method
  toSaveString: ->

  @loadStringAsMacroCommands: (text, findAndReplace) ->
    result = {}
    lines = text.split('\n')
    index = 0
    while index < lines.length
      line = lines[index++]
      if line.length == 0
        continue
      if line[0] != '>' or line.length < 2
        console.error 'illegal format when loading macro commands.'
        return null

      name = line.substring(1)
      #console.log('name: ', name)

      cmds = []

      while (index < lines.length) and (lines[index][0] == '*')
        line = lines[index++]
        if line[0] != '*' or line.length < 2
          console.error 'illegal format when loading macro commands.'
          return null

        switch line[1]
          when 'I'
            while (index < lines.length) and (lines[index][0] == ':')
              line = lines[index++]
              if line.length < 2
                continue
              for i in [1..line.length-1]
                event = MacroCommand.keydownEventFromString(line[i])
                cmds.push(new InputTextCommand(event))

          when 'D'
            line = lines[index++]
            if line[0] != ':' or line.length < 2
              console.error 'illegal format when loading macro commands.'
              return null
            cmd = new DispatchCommand('')
            cmd.command_name = line.substring(1) # fix this line
            cmds.push(cmd)

          when 'K'
            while (index < lines.length) and (lines[index][0] == ':')
              line = lines[index++]
              s = line.substring(1)
              event = MacroCommand.keydownEventFromString(s)
              cmds.push(new KeydownCommand(event))

          when 'P'  # Plugins: ex  '*P:atom-keyboard-macros-vim:singleInstansiateFromSavedString:options'
            items = line.split(':', 4)
            packageName = items[1]
            method = items[2]
            options = items[3] if items.length == 4
            targetPackage = atom.packages.getActivePackage(packageName)
            cmd = targetPackage?.mainModule?[method]?(options)
            cmds.push cmd if cmd

          when ':'
            cmdName = line.substring(2)
            switch cmdName
              when 'RPLALL'
                line = lines[index++]
                editText = line.substring(3)
                line = lines[index++]
                replaceText = line.substring(3)
                line = lines[index++].substring(3)
                opts = line.split(',')
                useRegex = opts[0].indexOf('true') >= 0
                caseSensitive = opts[1].indexOf('true') >= 0
                inCurrentSelection = opts[2].indexOf('true') >= 0
                wholeWord = opts[3].indexOf('true') >= 0
                cmds.push(new ReplaceAllCommand(findAndReplace, editText, replaceText, {
                  useRegex: useRegex
                  caseSensitive: caseSensitive
                  inCurrentSelection: inCurrentSelection
                  wholeWord: wholeWord
                }))

              when 'RPLNXT'
                line = lines[index++]
                editText = line.substring(3)
                line = lines[index++]
                replaceText = line.substring(3)
                line = lines[index++].substring(3)
                opts = line.split(',')
                useRegex = opts[0].indexOf('true') >= 0
                caseSensitive = opts[1].indexOf('true') >= 0
                inCurrentSelection = opts[2].indexOf('true') >= 0
                wholeWord = opts[3].indexOf('true') >= 0
                cmds.push(new ReplaceNextCommand(findAndReplace, editText, replaceText, {
                  useRegex: useRegex
                  caseSensitive: caseSensitive
                  inCurrentSelection: inCurrentSelection
                  wholeWord: wholeWord
                }))

              when 'RPLPRV'
                line = lines[index++]
                editText = line.substring(3)
                line = lines[index++]
                replaceText = line.substring(3)
                line = lines[index++].substring(3)
                opts = line.split(',')
                useRegex = opts[0].indexOf('true') >= 0
                caseSensitive = opts[1].indexOf('true') >= 0
                inCurrentSelection = opts[2].indexOf('true') >= 0
                wholeWord = opts[3].indexOf('true') >= 0
                cmds.push(new ReplacePreviousCommand(findAndReplace, editText, replaceText, {
                  useRegex: useRegex
                  caseSensitive: caseSensitive
                  inCurrentSelection: inCurrentSelection
                  wholeWord: wholeWord
                }))

              when 'SETPTN'
                line = lines[index++].substring(3)
                opts = line.split(',')
                useRegex = opts[0].indexOf('true') >= 0
                caseSensitive = opts[1].indexOf('true') >= 0
                inCurrentSelection = opts[2].indexOf('true') >= 0
                wholeWord = opts[3].indexOf('true') >= 0
                cmds.push(new SetSelectionAsFindPatternCommand(findAndReplace, {
                  useRegex: useRegex
                  caseSensitive: caseSensitive
                  inCurrentSelection: inCurrentSelection
                  wholeWord: wholeWord
                }))

              when 'FNDPRVSEL'
                line = lines[index++]
                editText = line.substring(3)
                line = lines[index++].substring(3)
                opts = line.split(',')
                useRegex = opts[0].indexOf('true') >= 0
                caseSensitive = opts[1].indexOf('true') >= 0
                inCurrentSelection = opts[2].indexOf('true') >= 0
                wholeWord = opts[3].indexOf('true') >= 0
                cmds.push(new FindPreviousSelectedCommand(findAndReplace, editText, {
                  useRegex: useRegex
                  caseSensitive: caseSensitive
                  inCurrentSelection: inCurrentSelection
                  wholeWord: wholeWord
                }))

              when 'FNDNXTSEL'
                line = lines[index++]
                editText = line.substring(3)
                line = lines[index++].substring(3)
                opts = line.split(',')
                useRegex = opts[0].indexOf('true') >= 0
                caseSensitive = opts[1].indexOf('true') >= 0
                inCurrentSelection = opts[2].indexOf('true') >= 0
                wholeWord = opts[3].indexOf('true') >= 0
                cmds.push(new FindNextSelectedCommand(findAndReplace, editText, {
                  useRegex: useRegex
                  caseSensitive: caseSensitive
                  inCurrentSelection: inCurrentSelection
                  wholeWord: wholeWord
                }))

              when 'FNDPRV'
                line = lines[index++]
                editText = line.substring(3)
                line = lines[index++].substring(3)
                opts = line.split(',')
                useRegex = opts[0].indexOf('true') >= 0
                caseSensitive = opts[1].indexOf('true') >= 0
                inCurrentSelection = opts[2].indexOf('true') >= 0
                wholeWord = opts[3].indexOf('true') >= 0
                cmds.push(new FindPreviousCommand(findAndReplace, editText, {
                  useRegex: useRegex
                  caseSensitive: caseSensitive
                  inCurrentSelection: inCurrentSelection
                  wholeWord: wholeWord
                }))

              when 'FNDPRV'
                line = lines[index++]
                editText = line.substring(3)
                line = lines[index++].substring(3)
                opts = line.split(',')
                useRegex = opts[0].indexOf('true') >= 0
                caseSensitive = opts[1].indexOf('true') >= 0
                inCurrentSelection = opts[2].indexOf('true') >= 0
                wholeWord = opts[3].indexOf('true') >= 0
                cmds.push(new FindNextCommand(findAndReplace, editText, {
                  useRegex: useRegex
                  caseSensitive: caseSensitive
                  inCurrentSelection: inCurrentSelection
                  wholeWord: wholeWord
                }))


          else
            console.error 'illegal format loading macro commands.'
            return null

      result[name] = cmds
      # end while

    result

  @keydownEventFromString: (keystroke) ->
    hasCtrl = keystroke.indexOf('ctrl-') > -1
    hasAlt = keystroke.indexOf('alt-') > -1
    hasShift = keystroke.indexOf('shift-') > -1
    hasCmd = keystroke.indexOf('cmd-') > -1
    s = keystroke.replace('ctrl-', '')
    s = s.replace('alt-', '')
    s = s.replace('shift-', '')
    key = s.replace('cmd-', '')
    event = keydownEvent(key, {
      ctrl: hasCtrl
      alt: hasAlt
      shift: hasShift
      cmd: hasCmd
    })
    event

  @findViewInitialize: ->
    result += tabs + "editorElement = atom.views.getView(atom.workspace.getActiveTextEditor())\n"
    result += tabs + "atom.commands.dispatch(editorElement, 'find-and-replace:toggle') # wake up if not active\n"
    result += tabs + "atom.commands.dispatch(editorElement, 'find-and-replace:toggle') # hide\n"
    result += tabs + "panels = atom.workspace.getBottomPanels()\n"
    result += tabs + "for panel in panels\n"
    result += tabs + "  item = panel.item\n"
    result += tabs + "  name = item?.__proto__?.constructor?.name\n"
    result += tabs + "  if name == 'FindView'\n"
    result += tabs + "    @findNext = item.findNext\n"
    result += tabs + "    @findPrevious = item.findPrevious\n"
    result += tabs + "    @findNextSelected = item.findNextSelected\n"
    result += tabs + "    @findPreviousSelected = item.findPreviousSelected\n"
    result += tabs + "    @setSelectionAsFindPattern = item.setSelectionAsFindPattern\n"
    result += tabs + "    @replacePrevious = item.replacePrevious\n"
    result += tabs + "    @replaceNext = item.replaceNext\n"
    result += tabs + "    @replaceAll = item.replaceAll\n"
    result += tabs + "    @findEditor = item.findEditor\n"
    result += tabs + "    @replaceEditor = item.replaceEditor\n"
    result += tabs + "    @replaceAllButton = item.replaceAllButton\n"
    result += tabs + "    @replaceNextButton = item.replaceNextButton\n"
    result += tabs + "    @nextButton = item.nextButton\n"
    result += tabs + "    @regexOptionButton = item.regexOptionButton\n"
    result += tabs + "    @caseOptionButton = item.caseOptionButton\n"
    result += tabs + "    @selectionOptionButton = item.selectionOptionButton\n"
    result += tabs + "    @wholeWordOptionButton = item.wholeWordOptionButton\n"

    MacroCommand.findViewInitialized = true


class InputTextCommand extends MacroCommand
  constructor: (@events) ->

  execute: ->
    for e in @events
      switch e.keyCode
        when 0x20
          # space(0x20)
          textInputEvent = document.createEvent("TextEvent")
          textInputEvent.initTextEvent("textInput", true, true, window, ' ')
          e.path[0].dispatchEvent(textInputEvent)

        when 0x09
          # tab(0x09)
          textInputEvent = document.createEvent("TextEvent")
          textInputEvent.initTextEvent("textInput", true, true, window, '\t')
          e.path[0].dispatchEvent(textInputEvent)

        else
          atom.keymaps.simulateTextInput(e)

  toString: (tabs) ->
    result = ''
    for e in @events
      s = atom.keymaps.keystrokeForKeyboardEvent(e)
      result += tabs + 'atom.keymaps.simulateTextInput(\'' + s + '\')\n'
    result

  toSaveString: ->
    result = '*I\n'
    for e in @events
      s = ':' + characterForKeyboardEvent(e) + '\n'
      result += s
    result

class DispatchCommand
  constructor: (@command_name) ->

  ###
  constructor: (keystroke) ->
    editor = atom.workspace.getActiveTextEditor()
    view = atom.views.getView(editor)
    bindings = atom.keymaps.findKeyBindings({keystrokes: keystroke, target: view})
    if bindings.length == 0
      @command_name = ''
      return
    else
      @command_name = bindings.command
      if !@command_name
        #console.log('bindings', bindings)
        bind = bindings[0]
        @command_name = bind.command
  ###

  execute: ->
    editor = atom.workspace.getActiveTextEditor()
    if editor
      view = atom.views.getView(editor)
      atom.commands.dispatch(view, @command_name)

  toString: (tabs) ->
    result = ''
    if !MacroCommand.viewInitialized
      result += tabs + 'editor = atom.workspace.getActiveTextEditor()\n'
      result += tabs + 'view = atom.views.getView(editor)\n'
      MacroCommand.viewInitialized = true
    result += tabs + 'atom.commands.dispatch(view, "' + @command_name + '")\n'
    result

  toSaveString: ->
    '*D\n:' + @command_name + '\n'

class KeydownCommand extends MacroCommand
  constructor: (@events) ->

  execute: ->
    for e in @events
      atom.keymaps.handleKeyboardEvent(e)

  toString: (tabs) ->
    result = ''
    if !MacroCommand.viewInitialized
      result += tabs + 'editor = atom.workspace.getActiveTextEditor()\n'
      result += tabs + 'view = atom.views.getView(editor)\n'
      MacroCommand.viewInitialized = true

    for e in @events
      result += tabs + "event = document.createEvent('KeyboardEvent')\n"
      result += tabs + "bubbles = true\n"
      result += tabs + "cancelable = true\n"
      result += tabs + "view = null\n"
      result += tabs + "alt = #{e.altKey}\n"
      result += tabs + "ctrl = #{e.ctrlKey}\n"
      result += tabs + "cmd = #{e.metaKey}\n"
      result += tabs + "shift = #{e.shiftKey}\n"
      result += tabs + "keyCode = #{e.keyCode}\n"
      result += tabs + "keyIdentifier = #{e.keyIdentifier}\n"
      result += tabs + "location ?= KeyboardEvent.DOM_KEY_LOCATION_STANDARD\n"
      result += tabs + "event.initKeyboardEvent('keydown', bubbles, cancelable, view,  keyIdentifier, location, ctrl, alt, shift, cmd)\n"
      result += tabs + "Object.defineProperty(event, 'keyCode', get: -> keyCode)\n"
      result += tabs + "Object.defineProperty(event, 'which', get: -> keyCode)\n"
      result += tabs + "atom.keymaps.handleKeyboardEvent(event)\n"
    result

  toSaveString: ->
    result = '*K\n'
    for e in @events
      result += ':' + keystrokeForKeyboardEvent(e) + '\n'
    result

#
# Find and Replace
#

class FRBaseCommand extends MacroCommand
  useRegex: false
  caseSensitive: false
  inCurrentSelection: false
  wholeWord: false

  constructor: (options) ->
    @useRegex = options.useRegex
    @caseSensitive = options.caseSensitive
    @inCurrentSelection = options.inCurrentSelection
    @wholeWord = options.wholeWord

  setOptions: (findAndReplace) ->
    opts = findAndReplace.model?.getFindOptions()
    opts?.useRegex = @useRegex
    opts?.caseSensitive = @caseSensitive
    opts?.inCurrentSelection = @inCurrentSelection
    opts?.wholeWord = @wholeWord
    findAndReplace.model?.setFindOptions(opts?)

#
# Find Next
class FindNextCommand extends FRBaseCommand
  constructor: (@findAndReplace, @text, @options) ->
    super(@options)

  execute: ->
    # set options
    @setOptions(@findAndReplace)
    # execute
    @findAndReplace.setFindText(@text)
    @findAndReplace.findNext(@options)

  toString: (tabs) ->
    result = ''
    if !MacroCommand.findViewInitialized
      result += MacroCommand.findViewInitialize()
    result += tabs + '@findEditor?.model?.buffer?.lines[0] = "' + @findText + '"\n'
    result += tabs + "atom.commands.dispatch(editorElement, 'find-and-replace:find-next')\n"
    result

  toSaveString: ->
    result = '*:FNDPRV\n'
    result += ':F:' + @findText + '\n'
    result += ':O:' + @useRegex + ',' + @caseSensitive + ',' + @inCurrentSelection + ',' + @wholeWord + '\n'
    result

#
# Find Previous
class FindPreviousCommand extends FRBaseCommand
  constructor: (@findAndReplace, @text, @options) ->
    super(@options)

  execute: ->
    # set options
    @setOptions(@findAndReplace)
    # execute
    @findAndReplace.setText(@text)
    @findAndReplace.findPrevious()

  toString: (tabs) ->
    result = ''
    if !MacroCommand.findViewInitialized
      result += MacroCommand.findViewInitialize()
    result += tabs + '@findEditor?.model?.buffer?.lines[0] = "' + @findText + '"\n'
    result += tabs + "atom.commands.dispatch(editorElement, 'find-and-replace:find-previous')\n"
    result

  toSaveString: ->
    result = '*:FNDPRV\n'
    result += ':F:' + @findText + '\n'
    result += ':O:' + @useRegex + ',' + @caseSensitive + ',' + @inCurrentSelection + ',' + @wholeWord + '\n'
    result

#
# Find Next Selected
class FindNextSelectedCommand extends FRBaseCommand
  constructor: (@findAndReplace, @text, @options) ->
    super(@options)

  execute: ->
    # set options
    @setOptions(@findAndReplace)
    # execute
    @findAndReplace.setText(@text)
    @findAndReplace.findNextSecected()

  toString: (tabs) ->
    result = ''
    if !MacroCommand.findViewInitialized
      result += MacroCommand.findViewInitialize()
    result += tabs + '@findEditor?.model?.buffer?.lines[0] = "' + @findText + '"\n'
    result += tabs + "atom.commands.dispatch(editorElement, 'find-and-replace:find-next-selected')\n"
    result

  toSaveString: ->
    result = '*:FNDNXTSEL\n'
    result += ':F:' + @findText + '\n'
    result += ':O:' + @useRegex + ',' + @caseSensitive + ',' + @inCurrentSelection + ',' + @wholeWord + '\n'
    result

#
# Find Previous Selected
class FindPreviousSelectedCommand extends FRBaseCommand
  constructor: (@findAndReplace, @text, @options) ->
    super(@options)

  execute: ->
    # set options
    @setOptions(@findAndReplace)
    # execute
    @findAndReplace.setFindText(@text)
    @findAndReplace.findPreviousSelected()

  toString: (tabs) ->
    result = ''
    if !MacroCommand.findViewInitialized
      result += MacroCommand.findViewInitialize()
    result += tabs + '@findEditor?.model?.buffer?.lines[0] = "' + @findText + '"\n'
    result += tabs + "atom.commands.dispatch(editorElement, 'find-and-replace:find-previous-selected')\n"
    result

  toSaveString: ->
    result = '*:FNDPRVSEL\n'
    result += ':F:' + @findText + '\n'
    result += ':O:' + @useRegex + ',' + @caseSensitive + ',' + @inCurrentSelection + ',' + @wholeWord + '\n'
    result

#
# Set Selection as Find Pattern
class SetSelectionAsFindPatternCommand extends FRBaseCommand
  constructor: (@findAndReplace, @options)->
    super(@options)

  execute: ->
    # set options
    @setOptions(@findAndReplace)
    # execute
    @findAndReplace.setSelectionAsFindPattern()

  toString: (tabs) ->
    result = ''
    if !MacroCommand.findViewInitialized
      result += MacroCommand.findViewInitialize()
    result += tabs + "atom.commands.dispatch(editorElement, 'find-and-replace:use-selection-as-find-pattern')\n"
    result

  toSaveString: ->
    result = '*:SETPTN\n'
    result += ':O:' + @useRegex + ',' + @caseSensitive + ',' + @inCurrentSelection + ',' + @wholeWord + '\n'
    result

#
# Replace Previous
class ReplacePreviousCommand extends FRBaseCommand
  constructor: (@findAndReplace, @findText, @replaceText, @options) ->
    super(@options)

  execute: ->
    # set options
    @setOptions(@findAndReplace)
    # execute
    @findAndReplace.setFindText(@findText)
    @findAndReplace.setReplaceText(@replaceText)
    @findAndReplace.replacePrevious()

  toString: (tabs) ->
    result = ''
    if !MacroCommand.findViewInitialized
      result += MacroCommand.findViewInitialize()
    result += tabs + '@findEditor?.model?.buffer?.lines[0] = "' + @findText + '"\n'
    result += tabs + '@replaceEditor?.model?.buffer?.lines[0] = "' + @replaceText + '"\n'
    result += tabs + "atom.commands.dispatch(editorElement, 'find-and-replace:replace-previous')\n"
    result

  toSaveString: ->
    result = '*:RPLPRV\n'
    result += ':F:' + @findText + '\n'
    result += ':R:' + @replaceText + '\n'
    result += ':O:' + @useRegex + ',' + @caseSensitive + ',' + @inCurrentSelection + ',' + @wholeWord + '\n'
    result

#
# Replace Next
class ReplaceNextCommand extends FRBaseCommand
  constructor: (@findAndReplace, @findText, @replaceText, @options) ->
    super(@options)

  execute: ->
    # set options
    @setOptions(@findAndReplace)
    # execute
    @findAndReplace.setFindText(@findText)
    @findAndReplace.setReplaceText(@replaceText)
    @findAndReplace.replaceNext()

  toString: (tabs) ->
    result = ''
    if !MacroCommand.findViewInitialized
      result += MacroCommand.findViewInitialize()
    result += tabs + '@findEditor?.model?.buffer?.lines[0] = "' + @findText + '"\n'
    result += tabs + '@replaceEditor?.model?.buffer?.lines[0] = "' + @replaceText + '"\n'
    result += tabs + "atom.commands.dispatch(editorElement, 'find-and-replace:replace-next')\n"
    result

  toSaveString: ->
    result = '*:RPLNXT\n'
    result += ':F:' + @findText + '\n'
    result += ':R:' + @replaceText + '\n'
    result += ':O:' + @useRegex + ',' + @caseSensitive + ',' + @inCurrentSelection + ',' + @wholeWord + '\n'
    result

#
# Replace All
class ReplaceAllCommand extends FRBaseCommand
  constructor: (@findAndReplace, @findText, @replaceText, @options) ->
    super(@options)

  execute: ->
    # set options
    @setOptions(@findAndReplace)
    # execute
    @findAndReplace.setFindText(@findText)
    @findAndReplace.setReplaceText(@replaceText)
    @findAndReplace.replaceAll()

  toString: (tabs) ->
    result = ''
    if !MacroCommand.findViewInitialized
      result += MacroCommand.findViewInitialize()
    result += tabs + '@findEditor?.model?.buffer?.lines[0] = "' + @findText + '"\n'
    result += tabs + '@replaceEditor?.model?.buffer?.lines[0] = "' + @replaceText + '"\n'
    result += tabs + "atom.commands.dispatch(editorElement, 'find-and-replace:replace-all')\n"
    result

  toSaveString: ->
    result = '*:RPLALL\n'
    result += ':F:' + @findText + '\n'
    result += ':R:' + @replaceText + '\n'
    result += ':O:' + @useRegex + ',' + @caseSensitive + ',' + @inCurrentSelection + ',' + @wholeWord + '\n'
    result

# Plugin
class PluginCommand extends MacroCommand
  constructor: (@plugin, @options) ->
    super(@options)

  execute: ->
    @plugin.execute(@options)

  toString: (tabs) ->
    @plugin.toString(tabs)

  toSaveString: ->
    @plugin.toSaveString(@options)

  instansiateFromSavedString: (str) ->
    @plugin.instansiateFromSavedString(str)

###
# Plugin Interface
class PluginInterface
  execute: (@options) ->

  toString: (tabs) ->

  toSaveString: ->

  instansiateFromSavedString: (str) ->
###


module.exports =
    MacroCommand: MacroCommand
    InputTextCommand: InputTextCommand
    KeydownCommand: KeydownCommand
    DispatchCommand: DispatchCommand
    FindNextCommand: FindNextCommand
    FindPreviousCommand: FindPreviousCommand
    FindNextSelectedCommand: FindNextSelectedCommand
    FindPreviousSelectedCommand: FindPreviousSelectedCommand
    SetSelectionAsFindPatternCommand: SetSelectionAsFindPatternCommand
    ReplacePreviousCommand: ReplacePreviousCommand
    ReplaceNextCommand: ReplaceNextCommand
    ReplaceAllCommand: ReplaceAllCommand
    PluginCommand: PluginCommand
