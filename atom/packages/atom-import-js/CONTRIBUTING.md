To make it simpler to test a local copy of ImportJS in Atom:

```sh
cd ~/atom-import-js
apm link
```

After making changes to the plugin, you can reload Atom by opening the console
(`CMD+OPTION+i`) and then refreshing (`CMD+r`).

## Publishing

```sh
git fetch origin
git checkout master
git rebase origin/master
apm publish (major|minor|patch)
git push origin master
git push --tags origin
```

## Code of conduct

This project adheres to the [Open Code of Conduct][code-of-conduct]. By
participating, you are expected to honor this code.

[code-of-conduct]: http://todogroup.org/opencodeofconduct/#Import-JS/henric.trotzig@gmail.com
