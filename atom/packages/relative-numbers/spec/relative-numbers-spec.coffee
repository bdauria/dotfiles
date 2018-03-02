util = require 'util'

describe 'Relative Line Numbers', ->
  beforeEach ->
    waitsForPromise =>
      return atom.packages.activatePackage('relative-numbers')
        .then (module) => @module = module

  it 'should be in the packages list', ->
    expect(@module).toBeDefined()
    expect(atom.packages.isPackageLoaded('relative-numbers'))

  it 'should be an active package', ->
    expect(atom.packages.isPackageActive('relative-numbers'))

  it 'should provide default config', ->
    expect(atom.config.get('relative-numbers.trueNumberCurrentLine')).toBe true
    expect(atom.config.get('relative-numbers.showAbsoluteNumbers')).toBe false
    expect(atom.config.get('relative-numbers.startAtOne')).toBe false

  describe 'Example Text File', ->
    beforeEach ->
      waitsForPromise =>
        return atom.workspace.open(__dirname + '/fixtures/example.txt')
          .then (editor) =>
            @editor = editor
            @editorView = atom.views.getView(editor)
            jasmine.attachToDOM(@editorView)

    it 'should open correctly', ->
      expect(@editor).toBeDefined()
      expect(@editor.getLineCount()).toBe(11)

    it 'should have added a gutter', ->
      expect(@editor.gutterWithName('relative-numbers')).not.toBe null

    it 'should show line numbers', ->
      expect(@editorView.querySelectorAll('.line-number').length).toBe 7
