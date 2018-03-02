# HTML language support in Atom with Angular 2 syntax support

[![apm](https://img.shields.io/apm/v/language-html-angular.svg)](https://atom.io/packages/language-html-angular)
[![The MIT License](https://img.shields.io/badge/license-MIT-orange.svg)](https://github.com/drootz/language-html-angular/blob/master/LICENSE.md)

Adds syntax highlighting and snippets to HTML files.

## Installation

Fire up a console and type:

        apm install language-html-angular

Or, inside Atom's settings select Install and then search for this package.

## Usage

Open a file in Atom editor and select the `HTML (ng2)` file syntax option.

Ensure to use a theme packages supporting Angular 2 syntax highlighting for this package:
- [greenish-holidays-ng2-syntax](https://atom.io/themes/greenish-holidays-ng2-syntax)
- [syntax-theme-boilerplate-syntax](https://atom.io/themes/syntax-theme-boilerplate-syntax)
- [tomorrow-night-eigthies-ng2-syntax](https://atom.io/themes/tomorrow-night-eighties-ng2-syntax)
- [yesterday-night-eighties-ng2-syntax](https://atom.io/themes/yesterday-night-eighties-ng2-syntax)

![](https://raw.githubusercontent.com/drootz/language-html-angular/master/img/preview-dark.png)

### Styling Scopes

#### Angular 2 attributes and tags scoped:
- `{{interpolation}}`
- `[target] = "expression"`
- `bind-target = "expression"`
- `(target) = "statement"`
- `on-target = "statement"`
- `[(target)] = "expression"`
- `bindon-target = "expression"`
- `*ngIf`, `*ngFor`, etc.
- Pipe Operator: `{{target | operator | chain}}`
- Template Tags: `<custom-tag></custom-tag>`
- Interpolation syntax highlighting

Here are the scopes used for styling the above attributes in a syntax theme:

````less

  .html {

    .entity.other.attribute-name.ng {
      color: @yellow !important;
    }

    .punctuation.separator.key-value.ng {
      color: @yellow !important;
    }

    .meta.attribute-with-value.ng {
      color: @blue !important;
    }

    .punctuation.definition.string.begin.ng {
      color: @blue !important;
    }

    .punctuation.definition.string.end.ng {
      color: @blue !important;
    }

    .meta.toc-list.ng {
      color: @blue !important;
    }

    .string.interpolation.html {
      color: @blue !important;
    }

    .punctuation.definition.interpolation.begin.ng {
      color: @yellow !important;
    }

    .punctuation.definition.interpolation.end.ng {
      color: @yellow !important;
    }

    .meta.definition.interpolation.ng {
      color: @blue !important;
    }

    .string.interpolation.pipe.ng {
      color: @orange !important;
    }

    .meta.ngfor-attribute.ng {
      color: @yellow !important;
    }

    .punctuation.definition.tag.ng {
      color: darken(@green,15%) !important;
    }

    .punctuation.definition.tag.begin.ng {
      color: darken(@green,15%) !important;
    }

    .punctuation.definition.tag.end.ng {
      color: darken(@green,15%) !important;
    }

    .entity.name.tag.ng {
      color: darken(@green,15%) !important;
    }

    .entity.name.tag.other.ng {
      color: darken(@green,15%) !important;
    }

    .meta.tag.any.ng {
      color: darken(@green,15%) !important;
    }

    .meta.tag.other.ng {
      color: darken(@green,15%) !important;
    }

    // Interpolation Syntax
    .punctuation.definition.js.string.begin.ng.html {
      color: @444444 !important;
    }

    .punctuation.definition.js.string.end.ng.html {
      color: @444444 !important;
    }

    .string.operator.ng {
      color: @syntax-text-color !important;
    }

    .string.bracket.ng {
      color: @syntax-text-color !important;
    }

    .string.js.bool.ng {
      color: @222222 !important;
    }

    .punctuation.definition.function.begin.ng {
      color: @666666 !important;
    }

    .punctuation.definition.function.end.ng {
      color: @666666 !important;
    }

    .meta.definition.function.ng {
      color: @333333 !important;
    }

  }

````

***

Forked from the [HTML package for Atom](https://atom.io/packages/language-html).
