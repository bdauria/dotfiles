# Angular2 Component Generation Extension for Atom

## Description
Extension automatically creates folder for angular2 component containing :
- `component.ts`
- `module.ts`
- `component.html`
- `component.css`

## Usage

- Right click on on the file or folder in the explorer
- Select "New Angular2 Component"
- Enter component name in the pop up in camelCase

![Use Extension](https://media.giphy.com/media/l3vR4BrhHp3DzihQA/source.gif)

## Configuration
- create true / false - (controls weather to generate this file or not)
- extension - extension of generated file (e.g. you might want to change "scss" to just plain "css")
- template - path to the custom template for the generated file
    - {selector}    -> replaced with `lower case, dash separated string`
    - {templateUrl} -> replaced with `${selector}.component.html`
    - {styleUrls}   -> replaced with `${selector}.component.css`
    - {className}   -> replaced with `componentName in PascalCase`

Use the "template" key to override default templates for the extension

```javascript
ng2ComponentGenerator:
  files:
    component:
      create: true
      extension: "ts"
      template: "${workspaceRoot}/my.template"
    css:
      create: true
      extension: "scss"
    html:
      create: true
      extension: "html"
    module:
      create: true
      extension: "ts"
```
![Config Extension](https://media.giphy.com/media/3oz8xyuAbBHOWJP2Ba/source.gif)

## Bugs

Please report [here](https://github.com/dbaikov/vscode-angular2-component-generator/issues)
