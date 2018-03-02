"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const sinon = require("sinon");
const memfs_1 = require("../memfs");
const plugins_1 = require("../plugins");
const util_1 = require("../util");
describe('plugins', () => {
    describe('loadPlugins()', () => {
        it('should do nothing if no plugins are configured', () => {
            const memfs = new memfs_1.InMemoryFileSystem('/');
            const loader = new plugins_1.PluginLoader('/', memfs);
            const compilerOptions = {};
            const applyProxy = sinon.spy();
            loader.loadPlugins(compilerOptions, applyProxy);
        });
        it('should load a global plugin if specified', () => {
            const memfs = new memfs_1.InMemoryFileSystem('/');
            const peerPackagesPath = path.resolve(__filename, '../../../../');
            const peerPackagesUri = util_1.path2uri(peerPackagesPath);
            memfs.add(peerPackagesUri + '/node_modules/some-plugin/package.json', '{ "name": "some-plugin", "version": "0.1.1", "main": "plugin.js"}');
            memfs.add(peerPackagesUri + '/node_modules/some-plugin/plugin.js', '');
            const pluginSettings = {
                globalPlugins: ['some-plugin'],
                allowLocalPluginLoads: false,
                pluginProbeLocations: [],
            };
            const pluginFactoryFunc = (modules) => 5;
            const fakeRequire = (path) => pluginFactoryFunc;
            const loader = new plugins_1.PluginLoader('/', memfs, pluginSettings, undefined, memfs, fakeRequire);
            const compilerOptions = {};
            const applyProxy = sinon.spy();
            loader.loadPlugins(compilerOptions, applyProxy);
            sinon.assert.calledOnce(applyProxy);
            sinon.assert.calledWithExactly(applyProxy, pluginFactoryFunc, sinon.match({ name: 'some-plugin', global: true }));
        });
        it('should load a local plugin if specified', () => {
            const rootDir = (process.platform === 'win32' ? 'c:\\' : '/') + 'some-project';
            const rootUri = util_1.path2uri(rootDir) + '/';
            const memfs = new memfs_1.InMemoryFileSystem('/some-project');
            memfs.add(rootUri + 'node_modules/some-plugin/package.json', '{ "name": "some-plugin", "version": "0.1.1", "main": "plugin.js"}');
            memfs.add(rootUri + 'node_modules/some-plugin/plugin.js', '');
            const pluginSettings = {
                globalPlugins: [],
                allowLocalPluginLoads: true,
                pluginProbeLocations: [],
            };
            const pluginFactoryFunc = (modules) => 5;
            const fakeRequire = (path) => pluginFactoryFunc;
            const loader = new plugins_1.PluginLoader(rootDir, memfs, pluginSettings, undefined, memfs, fakeRequire);
            const pluginOption = {
                name: 'some-plugin',
            };
            const compilerOptions = {
                plugins: [pluginOption],
            };
            const applyProxy = sinon.spy();
            loader.loadPlugins(compilerOptions, applyProxy);
            sinon.assert.calledOnce(applyProxy);
            sinon.assert.calledWithExactly(applyProxy, pluginFactoryFunc, sinon.match(pluginOption));
        });
    });
});
//# sourceMappingURL=plugins.test.js.map