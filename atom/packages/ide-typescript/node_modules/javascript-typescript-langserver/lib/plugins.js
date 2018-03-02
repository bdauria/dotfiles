"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("mz/fs");
const path = require("path");
const ts = require("typescript");
const logging_1 = require("./logging");
const match_files_1 = require("./match-files");
const util_1 = require("./util");
/**
 * A local filesystem-based ModuleResolutionHost for plugin loading.
 */
class LocalModuleResolutionHost {
    fileExists(fileName) {
        return fs.existsSync(fileName);
    }
    readFile(fileName) {
        return fs.readFileSync(fileName, 'utf8');
    }
}
exports.LocalModuleResolutionHost = LocalModuleResolutionHost;
class PluginLoader {
    constructor(rootFilePath, fs, pluginSettings, logger = new logging_1.NoopLogger(), resolutionHost = new LocalModuleResolutionHost(), requireModule = require) {
        this.rootFilePath = rootFilePath;
        this.fs = fs;
        this.logger = logger;
        this.resolutionHost = resolutionHost;
        this.requireModule = requireModule;
        this.allowLocalPluginLoads = false;
        this.globalPlugins = [];
        this.pluginProbeLocations = [];
        if (pluginSettings) {
            this.allowLocalPluginLoads = pluginSettings.allowLocalPluginLoads || false;
            this.globalPlugins = pluginSettings.globalPlugins || [];
            this.pluginProbeLocations = pluginSettings.pluginProbeLocations || [];
        }
    }
    loadPlugins(options, applyProxy) {
        // Search our peer node_modules, then any globally-specified probe paths
        // ../../.. to walk from X/node_modules/javascript-typescript-langserver/lib/project-manager.js to X/node_modules/
        const searchPaths = [match_files_1.combinePaths(__filename, '../../..'), ...this.pluginProbeLocations];
        // Corresponds to --allowLocalPluginLoads, opt-in to avoid remote code execution.
        if (this.allowLocalPluginLoads) {
            const local = this.rootFilePath;
            this.logger.info(`Local plugin loading enabled; adding ${local} to search paths`);
            searchPaths.unshift(local);
        }
        let pluginImports = [];
        if (options.plugins) {
            pluginImports = options.plugins;
        }
        // Enable tsconfig-specified plugins
        if (options.plugins) {
            for (const pluginConfigEntry of pluginImports) {
                this.enablePlugin(pluginConfigEntry, searchPaths, applyProxy);
            }
        }
        if (this.globalPlugins) {
            // Enable global plugins with synthetic configuration entries
            for (const globalPluginName of this.globalPlugins) {
                // Skip already-locally-loaded plugins
                if (!pluginImports || pluginImports.some(p => p.name === globalPluginName)) {
                    continue;
                }
                // Provide global: true so plugins can detect why they can't find their config
                this.enablePlugin({ name: globalPluginName, global: true }, searchPaths, applyProxy);
            }
        }
    }
    /**
     * Tries to load and enable a single plugin
     * @param pluginConfigEntry
     * @param searchPaths
     */
    enablePlugin(pluginConfigEntry, searchPaths, enableProxy) {
        for (const searchPath of searchPaths) {
            const resolvedModule = this.resolveModule(pluginConfigEntry.name, searchPath);
            if (resolvedModule) {
                enableProxy(resolvedModule, pluginConfigEntry);
                return;
            }
        }
        this.logger.error(`Couldn't find ${pluginConfigEntry.name} anywhere in paths: ${searchPaths.join(',')}`);
    }
    /**
     * Load a plugin using a node require
     * @param moduleName
     * @param initialDir
     */
    resolveModule(moduleName, initialDir) {
        const resolvedPath = util_1.toUnixPath(path.resolve(match_files_1.combinePaths(initialDir, 'node_modules')));
        this.logger.info(`Loading ${moduleName} from ${initialDir} (resolved to ${resolvedPath})`);
        const result = this.requirePlugin(resolvedPath, moduleName);
        if (result.error) {
            this.logger.error(`Failed to load module: ${JSON.stringify(result.error)}`);
            return undefined;
        }
        return result.module;
    }
    /**
     * Resolves a loads a plugin function relative to initialDir
     * @param initialDir
     * @param moduleName
     */
    requirePlugin(initialDir, moduleName) {
        try {
            const modulePath = this.resolveJavaScriptModule(moduleName, initialDir, this.fs);
            return { module: this.requireModule(modulePath), error: undefined };
        }
        catch (error) {
            return { module: undefined, error };
        }
    }
    /**
     * Expose resolution logic to allow us to use Node module resolution logic from arbitrary locations.
     * No way to do this with `require()`: https://github.com/nodejs/node/issues/5963
     * Throws an error if the module can't be resolved.
     * stolen from moduleNameResolver.ts because marked as internal
     */
    resolveJavaScriptModule(moduleName, initialDir, host) {
        // TODO: this should set jsOnly=true to the internal resolver, but this parameter is not exposed on a public api.
        const result = ts.nodeModuleNameResolver(moduleName, initialDir.replace('\\', '/') + '/package.json' /* containingFile */, { moduleResolution: ts.ModuleResolutionKind.NodeJs, allowJs: true }, this.resolutionHost, undefined);
        if (!result.resolvedModule) {
            // this.logger.error(result.failedLookupLocations);
            throw new Error(`Could not resolve JS module ${moduleName} starting at ${initialDir}.`);
        }
        return result.resolvedModule.resolvedFileName;
    }
}
exports.PluginLoader = PluginLoader;
//# sourceMappingURL=plugins.js.map