# Add support for a new plugin
If you have reached this by clicking on a rule name from a linting error message, it likely means that you are using TSLint rules from a
plugin that isn't known by this package.

You can search the [list of supported plugins](https://github.com/Xapphire13/tslint-rule-documentation/blob/master/src/plugins.json) to
make sure it's not there, and _if_ it is, [file an issue](https://github.com/Xapphire13/tslint-rule-documentation/issues) as something
went wrong.

If it's not there you can still file an issue (hoping someone else will add it), or help out the community and add it yourself!

# How to add a plugin
1.  Find the location of the plugin documentation. You can search [npm](https://www.npmjs.com/) or GitHub to assist with this.
2.  Once you know where the documentation is, figure out the URI format, an example may be
`https://github.com/<username>/<pluginName>/blob/master/docs/rules/RULENAME.md`, where `RULENAME` is a placeholder for the name of the rule.
3.  Fork this repository, edit `plugins.json` to include the plugin entry in the list. There is an example in the file to help you get the
format right (`"__example": "https://github.com/<user>/<repo>/blob/master/docs/RULENAME.md"`). **Please keep this list alphabetized**
4.  Create a [pull request](https://github.com/Xapphire13/tslint-rule-documentation/pulls) with details of your change and what plugin
you are enabling.

Thanks for helping out!
