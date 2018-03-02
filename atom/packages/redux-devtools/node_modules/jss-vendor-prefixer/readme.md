![JSS logo](https://avatars1.githubusercontent.com/u/9503099?v=3&s=60)

## JSS plugin that handles vendor prefixes on the browser

This vendor prefixer knows which properties and values are supported in the
current runtime and changes only whats required.
The best thing is - you don't need to download all of them.
Also it is very fast, all checks are cached.

[Demo](http://jsstyles.github.io/jss-examples/index.html#plugin-jss-vendor-prefixer) -
[JSS](https://github.com/jsstyles/jss)

[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/jsstyles/jss?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


## Usage example

```javascript
import jss from 'jss'
import vendorPrefixer from 'jss-vendor-prefixer'

jss.use(vendorPrefixer())

let sheet = jss.createStyleSheet({
  container: {
    transform: 'translateX(100px)'
  }
})
```

```javascript
console.log(styleSheet.toString())
```
```css
.jss-0-0 {
  transform: -webkit-translateX(100px);
}
```

```javascript
console.log(styleSheet.classes)
```
```javascript
{ container: "jss-0-0" }
```

## Run tests

```bash
npm i
npm run test
```

## License

MIT
