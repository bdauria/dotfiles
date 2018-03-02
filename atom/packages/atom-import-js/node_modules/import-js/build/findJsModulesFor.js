Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dedupeAndSort = dedupeAndSort;
exports['default'] = findJsModulesFor;

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

var _sortBy = require('lodash/sortBy');

var _sortBy2 = _interopRequireDefault(_sortBy);

var _uniqBy = require('lodash/uniqBy');

var _uniqBy2 = _interopRequireDefault(_uniqBy);

var _Configuration = require('./Configuration');

var _Configuration2 = _interopRequireDefault(_Configuration);

var _JsModule = require('./JsModule');

var _JsModule2 = _interopRequireDefault(_JsModule);

var _ModuleFinder = require('./ModuleFinder');

var _ModuleFinder2 = _interopRequireDefault(_ModuleFinder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function findImportsFromEnvironment(config, variableName) {
  return config.get('coreModules').filter(function (dep) {
    return dep.toLowerCase() === variableName.toLowerCase();
  }).map(function (dep) {
    return new _JsModule2['default']({
      importPath: dep,
      variableName
    });
  });
}

function findJsModulesFromModuleFinder(config, normalizedName, variableName, finder, pathToCurrentFile) {
  var options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

  return new Promise(function (resolve, reject) {
    var isWantedPackageDependency = Boolean;
    if (!config.get('importDevDependencies')) {
      var packageDependencies = config.get('packageDependencies');
      isWantedPackageDependency = function isWantedPackageDependency(packageName) {
        return packageDependencies.has(packageName);
      };
    }

    var isSearch = !!options.search;
    var method = isSearch ? 'search' : 'find';

    finder[method](normalizedName).then(function (exports) {
      var modules = exports.map(function (_ref) {
        var name = _ref.name,
            path = _ref.path,
            isDefault = _ref.isDefault,
            isType = _ref.isType,
            packageName = _ref.packageName;
        // eslint-disable-line object-curly-newline
        // Filter out modules that are in the `excludes` config.
        var isExcluded = config.get('excludes').some(function (glob) {
          return (0, _minimatch2['default'])(path, glob);
        });
        if (isExcluded) {
          return undefined;
        }

        if (packageName) {
          if (!isWantedPackageDependency(packageName)) {
            return undefined;
          }
          return new _JsModule2['default']({
            importPath: packageName,
            variableName: isSearch ? name : variableName,
            hasNamedExports: !isDefault,
            isType
          });
        }

        return _JsModule2['default'].construct({
          hasNamedExports: !isDefault,
          isType,
          relativeFilePath: path,
          stripFileExtensions: config.get('stripFileExtensions', {
            pathToImportedModule: path
          }),
          makeRelativeTo: config.get('useRelativePaths', {
            pathToImportedModule: path
          }) && config.pathToCurrentFile,
          variableName: isSearch ? name : variableName,
          workingDirectory: config.workingDirectory
        });
      });
      resolve(modules.filter(Boolean));
    })['catch'](reject);
  });
}

function dedupeAndSort(modules) {
  // We might end up having duplicate modules here.  In order to dedupe
  // these, we remove the module with the longest path
  var sorted = (0, _sortBy2['default'])(modules, function (module) {
    return module.importPath.length;
  });
  var uniques = (0, _uniqBy2['default'])(sorted,
  // Default export and named export with same name from the same module are not considered dupes
  function (module) {
    return [module.importPath, module.hasNamedExports].join();
  });
  // Sorting by path, but with default exports before named exports
  return (0, _sortBy2['default'])(uniques, function (module) {
    return [module.importPath, module.hasNamedExports ? 1 : 0].join();
  });
}

var NON_PATH_ALIAS_PATTERN = /^[a-zA-Z0-9-_]+$/;

function findJsModulesFor(config, variableName, options) {
  return new Promise(function (resolve, reject) {
    var normalizedName = variableName;
    var alias = config.resolveAlias(variableName);
    if (alias) {
      if (NON_PATH_ALIAS_PATTERN.test(alias)) {
        // The alias is likely a package dependency. We can use it in the
        // ModuleFinder lookup.
        normalizedName = alias;
      } else {
        // The alias is a path of some sort. Use it directly as the moduleName
        // in the import.
        resolve([new _JsModule2['default']({ importPath: alias, variableName })]);
        return;
      }
    }

    var namedImportsModule = config.resolveNamedExports(variableName);
    if (namedImportsModule) {
      resolve([namedImportsModule]);
      return;
    }

    var matchedModules = [];

    matchedModules.push.apply(matchedModules, _toConsumableArray(findImportsFromEnvironment(config, variableName)));

    var finder = _ModuleFinder2['default'].getForWorkingDirectory(config.workingDirectory, {
      excludes: config.get('excludes'),
      ignorePackagePrefixes: config.get('ignorePackagePrefixes')
    });
    findJsModulesFromModuleFinder(config, normalizedName, variableName, finder, config.pathToCurrentFile, options).then(function (modules) {
      matchedModules.push.apply(matchedModules, _toConsumableArray(modules));
      resolve(dedupeAndSort(matchedModules));
    })['catch'](function (error) {
      reject(error);
    });
  });
}