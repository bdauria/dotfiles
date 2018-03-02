# Emmet abbreviation transformer for HTML [![Build Status](https://travis-ci.org/emmetio/html-transform.svg?branch=master)](https://travis-ci.org/emmetio/html-transform)

This modules takes parsed Emmet abbreviation tree and transforms it for markup syntax (HTML, XML, Pug, Slim etc.) output. This transformation includes:

* **Implicit tag name resolving.** Fills omitted tag names, depending on parent’s name. For example, `table>.row>.cell` will be resolved to `table>tr.row>td.cell` equivalent. 
* **Item Numbering.** Replaces `$` symbol in node’s name, attributes and content with repeater value. For example, `.item$*3` will produce nodes with `item1`, `item2` and `item3` class names. Multiple `$` will zero-pad repeater value, e.g. `$$$` → `001`...`012`...`123`. Precede `$` character with `\` to skip numbering on it and keep as is.
* **Content insertion.** A part of [Wrap With Abbreviation](http://docs.emmet.io/actions/wrap-with-abbreviation/) action: clones implicitly repeated element (like `li*`) for every item of given content array and inserts item content into cloned node.

## Usage

```js
import parse from '@emmetio/abbreviation';
import transform from '@emmetio/html-transform';

const abbr = transform(parse('ul>.item$*'), ['foo', 'bar']);
// `abbr` now holds equivalent of `ul>li.item1{foo}+li.item2{bar}` abbreviation
```
