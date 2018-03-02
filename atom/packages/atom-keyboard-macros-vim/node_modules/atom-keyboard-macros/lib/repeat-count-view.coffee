module.exports =
class RepeatCountView
  callback: null

  constructor: (serializedState) ->
    # Create root element
    @element = document.createElement('div')
    @element.classList.add('atom-keyboard-macros')

    # Create message element
    message = document.createElement('div')
    message.textContent = "Repeat count:"
    message.classList.add('message')
    @element.appendChild(message)

    self = this

    @input = document.createElement('input')
    @input.type = 'number'
    @input.defaultValue = 1
    #@input.onkeydown = (e) ->
    #  if e.keyIdentifier == 'Enter' and self.callback
    #    self.callback(self.input.value)
    message.appendChild(@input)

    button = document.createElement('button')
    button.type = 'submit'
    button.textContent = 'Execute Macro'
    button.onclick = (e) ->
      if self.callback
        self.callback(self.input.value)
    message.appendChild(button)

  # Returns an object that can be retrieved when package is activated
  serialize: ->

  # Tear down any state and detach
  destroy: ->
    @element.remove()

  getElement: ->
    @element

  setCallback: (callback) ->
    @callback = callback
