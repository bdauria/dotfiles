module.exports =
class AtomKeyboardMacrosView
  constructor: (serializedState) ->
    # Create root element
    @element = document.createElement('div')
    @element.classList.add('atom-keyboard-macros')

    # Create message element
    message = document.createElement('div')
    message.textContent = "<<atom-keyboard-macros panel>>"
    message.classList.add('message')
    @element.appendChild(message)

  # Returns an object that can be retrieved when package is activated
  serialize: ->

  # Tear down any state and detach
  destroy: ->
    @element.remove()

  getElement: ->
    @element

  setText: (text) ->
    @element.children[0].textContent = text
    # redraw
    @element.children[0].style.display = 'none'
    @element.children[0].style.display = 'block'
