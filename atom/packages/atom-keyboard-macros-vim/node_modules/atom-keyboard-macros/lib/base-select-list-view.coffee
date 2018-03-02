{SelectListView, $, $$} = require 'atom-space-pen-views'
{match} = require 'fuzzaldrin'
fuzzaldrinPlus = require 'fuzzaldrin-plus'

module.exports =
class BaseSelectListView extends SelectListView
  model: null
  panel: null
  callback: null

  @config:
    useAlternateScoring:
      type: 'boolean'
      default: true
      description: 'Use an alternative scoring approach which prefers run of consecutive characters, acronyms and start of words. (Experimental)'

  @activate: ->

  @deactivate: ->
    @scoreSubscription?.dispose()

  constructor: (state, @model) ->
    super state

  initialize: (@listOfItems) ->
    super

    @alternateScoring = atom.config.get 'atom-keyboard-macros.useAlternateScoring'
    @scoreSubscription = atom.config.onDidChange 'atom-keyboard-macros.useAlternateScoring', ({newValue}) => @alternateScoring = newValue

    @addClass('atom-keyboard-macros')
    @setItems @listOfItems

  show: ->
    @panel ?= atom.workspace.addModalPanel(item: this)
    @panel.show()

    @storeFocusedElement()

    if @previouslyFocusedElement[0] and @previouslyFocusedElement[0] isnt document.body
      @eventElement = @previouslyFocusedElement[0]
    else
      @eventElement = atom.views.getView(atom.workspace)

    items = @model.getListOfItems()
    @setItems items

    @focusFilterEditor()

  hide: ->
    @panel?.hide()

  addItem: (item) ->
    @model.addItem item
    @setItems @model.getListOfItems()

  clearText: ->
    @filterEditorView.setText('')

  setCallback: (callback) ->
    @callback = callback

  focus: ->
    @focusFilterEditor()

  getElement: ->
    @element

  cancel: ->
    @clearText()
    @hide()

  confirmed: (obj) ->
    filterKey = @getFilterKey()
    name = obj[filterKey]
    @clearText()
    @hide()
    @callback?(name)

  getFilterKey: ->
    @model.getFilterKey()

  viewForItem: (obj) ->
    filterKey = @getFilterKey()
    name = obj[filterKey]
    if @model.viewForItem
      @model.viewForItem name
    else
      @altViewForItem name

  altViewForItem: (name) ->
    # Style matched characters in search results
    filterQuery = @getFilterQuery()
    if @alternateScoring
      matches = fuzzaldrinPlus.match(name, filterQuery)
    else
      matches = match(name, filterQuery)
    matches = match(name, filterQuery)

    $$ ->
      highlighter = (command, matches, offsetIndex) =>
        lastIndex = 0
        matchedChars = [] # Build up a set of matched chars to be more semantic

        for matchIndex in matches
          matchIndex -= offsetIndex
          continue if matchIndex < 0 # If marking up the basename, omit command matches
          unmatched = command.substring(lastIndex, matchIndex)
          if unmatched
            @span matchedChars.join(''), class: 'character-match' if matchedChars.length
            matchedChars = []
            @text unmatched
          matchedChars.push(command[matchIndex])
          lastIndex = matchIndex + 1

        @span matchedChars.join(''), class: 'character-match' if matchedChars.length

        # Remaining characters are plain text
        @text command.substring(lastIndex)

      @li class: 'event', 'data-event-name': name, =>
        @span title: name, -> highlighter(name, matches, 0)

  populateList: ->
    if @model.populateList
      return @model.populateList()

    if @alternateScoring
      @populateAlternateList()
    else
      super

  # This is modified copy/paste from SelectListView#populateList, require jQuery!
  # Should be temporary
  populateAlternateList: ->
    return unless @items?

    filterQuery = @getFilterQuery()
    if filterQuery.length
      filteredItems = fuzzaldrinPlus.filter(@items, filterQuery, key: 'name')
    else
      filteredItems = @items

    @list.empty()
    if filteredItems.length
      @setError(null)

      for i in [0...Math.min(filteredItems.length, @maxItems)]
        item = filteredItems[i]
        itemView = $(@viewForItem(item))
        itemView.data('select-list-item', item)
        @list.append(itemView)

      @selectItemView(@list.find('li:first'))
    else
      @setError(@getEmptyMessage(@items.length, filteredItems.length))
