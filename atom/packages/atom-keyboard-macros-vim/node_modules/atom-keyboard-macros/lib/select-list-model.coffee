module.exports =
class SelectListModel
  items: null

  #
  # Public: override if needed
  #
  getListOfItems: ->
    @items

  addItem: (item) ->
    @items ?= []
    unless @existsItem item
      @items.push
        name: item

  getFilterKey: ->
    'name'

  # optional
  #viewForItem: (item) ->

  # optional
  #populateList: ->

  #
  # Private
  #
  existsItem: (item) ->
    for obj in @items
      if obj.name == item
        return true
    false
