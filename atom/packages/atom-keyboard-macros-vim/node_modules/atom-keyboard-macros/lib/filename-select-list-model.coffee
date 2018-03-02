fs = require 'fs'
SelectListModel = require './select-list-model'

module.exports =
class FilenameSelectListModel extends SelectListModel
  constructor: (@macro_dirname) ->

  getListOfItems: ->
    exists = fs.existsSync @macro_dirname
    unless exists
      return []

    @items = []
    for filename in fs.readdirSync @macro_dirname
      @items.push
        name: filename

    @items
