[![Build Status](https://img.shields.io/travis/Xapphire13/tslint-rule-documentation/master.svg)](https://travis-ci.org/Xapphire13/tslint-rule-documentation)
[![npm](https://img.shields.io/npm/v/tslint-rule-documentation.svg)](https://www.npmjs.com/package/tslint-rule-documentation)
[![npm](https://img.shields.io/npm/dt/tslint-rule-documentation.svg)](https://www.npmjs.com/package/tslint-rule-documentation)
[![Greenkeeper badge](https://badges.greenkeeper.io/Xapphire13/tslint-rule-documentation.svg)](https://greenkeeper.io/)
# tslint-rule-documentation 
Find the url for the documentation of a [TSLint](https://palantir.github.io/tslint/) rule

# Install
```
npm install --save tslint-rule-documentation
```

# Usage
```js
const getRuleUri = require("tslint-rule-documentation").getRuleUri;

// find uri for core rules
getRuleUri("no-var-keyword");
// => { found: true, uri: "https://palantir.github.io/tslint/rules/no-var-keyword"}

// find uri for known plugins
getRuleUri("__example/foo");
// => { found: true, uri: "https://github.com/<user>/<repo>/blob/master/docs/foo.md"}

// If the plugin is not known, get a link to help improve this
getRuleUri("unknown-plugin/foo");
// => { found: false, uri: "https://github.com/Xapphire13/tslint-rule-documentation/blob/master/CONTRIBUTING.md"}
```

# Contributing
If a plugin you use is _not_ in the [list of supported plugins](https://github.com/Xapphire13/tslint-rule-documentation/blob/master/src/plugins.json),
please consider adding it to the project by following the instructions [here](https://github.com/Xapphire13/tslint-rule-documentation/blob/master/CONTRIBUTING.md).

# API
### getRuleUri(ruleId: string): IRuleResult
#### ruleId
Type: `string`
The ID of a [TSLint](https://palantir.github.io/tslint/) rule

Examples:
*   core rule: `no-var-keyword`
*   plugin rule: `__example/foo`

#### returns
Type: `IRuleResult`
```TypeScript
interface IRuleResult {
    found: boolean; // true if the rule is a TSLint core rule, or a known plugin rule, false otherwise
    uri: string; // If found is true, uri of the documentation of the rule. If found is false, uri of the contribution guidelines
}
```

# Credit
This is based on [eslint-rules-documentation](https://github.com/jfmengels/eslint-rule-documentation), so I would like to thank the authors of that for the inspiration and code to base this on.

# License
MIT
