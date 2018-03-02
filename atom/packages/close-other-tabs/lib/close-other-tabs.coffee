module.exports =
  activate: ->
    atom.commands.add 'atom-workspace', "close-other-tabs:close-other-tabs", => @init()

  init: ->
    tabBar = atom.views.getView(atom.workspace.getPanes()[0])
    tabBarElement = tabBar.querySelector(".tab-bar")
    tabBarElement.querySelector(".right-clicked") && tabBarElement.querySelector(".right-clicked").classList.remove("right-clicked")
    tabBarElement.querySelector(".active").classList.add("right-clicked")
    atom.commands.dispatch(tabBar, 'tabs:close-other-tabs')
    tabBarElement.querySelector(".active").classList.remove("right-clicked")
