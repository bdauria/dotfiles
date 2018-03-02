SelectListModel = require './select-list-model'

module.exports =
class MacroNameSelectListModel extends SelectListModel
  existsItem: (item) ->
    for obj in @items
      if obj.name == item
        return true
    false

  addItem: (item) ->
    @items ?= []
    unless @existsItem item
      @items.push
        name: item
