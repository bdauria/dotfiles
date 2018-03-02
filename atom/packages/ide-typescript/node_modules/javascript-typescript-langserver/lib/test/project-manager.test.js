"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const fs_1 = require("../fs");
const memfs_1 = require("../memfs");
const project_manager_1 = require("../project-manager");
const util_1 = require("../util");
const fs_helpers_1 = require("./fs-helpers");
chai.use(chaiAsPromised);
const assert = chai.assert;
describe('ProjectManager', () => {
    for (const rootUri of ['file:///', 'file:///c:/foo/bar/', 'file:///foo/bar/']) {
        describe(`with rootUri ${rootUri}`, () => {
            let projectManager;
            let memfs;
            it('should add a ProjectConfiguration when a tsconfig.json is added to the InMemoryFileSystem', () => {
                const rootPath = util_1.uri2path(rootUri);
                memfs = new memfs_1.InMemoryFileSystem(rootPath);
                const configFileUri = rootUri + 'foo/tsconfig.json';
                const localfs = new fs_helpers_1.MapFileSystem(new Map([[configFileUri, '{}']]));
                const updater = new fs_1.FileSystemUpdater(localfs, memfs);
                projectManager = new project_manager_1.ProjectManager(rootPath, memfs, updater, true);
                memfs.add(configFileUri, '{}');
                const configs = Array.from(projectManager.configurations());
                const expectedConfigFilePath = util_1.uri2path(configFileUri);
                assert.isDefined(configs.find(config => config.configFilePath === expectedConfigFilePath));
            });
            describe('ensureBasicFiles', () => {
                beforeEach(() => __awaiter(this, void 0, void 0, function* () {
                    const rootPath = util_1.uri2path(rootUri);
                    memfs = new memfs_1.InMemoryFileSystem(rootPath);
                    const localfs = new fs_helpers_1.MapFileSystem(new Map([
                        [rootUri + 'project/package.json', '{"name": "package-name-1"}'],
                        [rootUri + 'project/tsconfig.json', '{ "compilerOptions": { "typeRoots": ["../types"]} }'],
                        [
                            rootUri + 'project/node_modules/%40types/mocha/index.d.ts',
                            'declare var describe { (description: string, spec: () => void): void; }',
                        ],
                        [rootUri + 'project/file.ts', 'describe("test", () => console.log(GLOBALCONSTANT));'],
                        [rootUri + 'types/types.d.ts', 'declare var GLOBALCONSTANT=1;'],
                    ]));
                    const updater = new fs_1.FileSystemUpdater(localfs, memfs);
                    projectManager = new project_manager_1.ProjectManager(rootPath, memfs, updater, true);
                }));
                it('loads files from typeRoots', () => __awaiter(this, void 0, void 0, function* () {
                    const sourceFileUri = rootUri + 'project/file.ts';
                    const typeRootFileUri = rootUri + 'types/types.d.ts';
                    yield projectManager.ensureReferencedFiles(sourceFileUri).toPromise();
                    memfs.getContent(typeRootFileUri);
                    const config = projectManager.getConfiguration(util_1.uri2path(sourceFileUri), 'ts');
                    const host = config.getHost();
                    const typeDeclarationPath = util_1.uri2path(typeRootFileUri);
                    assert.includeMembers(host.getScriptFileNames(), [typeDeclarationPath]);
                }));
                it('loads mocha global type declarations', () => __awaiter(this, void 0, void 0, function* () {
                    const sourceFileUri = rootUri + 'project/file.ts';
                    const mochaDeclarationFileUri = rootUri + 'project/node_modules/%40types/mocha/index.d.ts';
                    yield projectManager.ensureReferencedFiles(sourceFileUri).toPromise();
                    memfs.getContent(mochaDeclarationFileUri);
                    const config = projectManager.getConfiguration(util_1.uri2path(sourceFileUri), 'ts');
                    const host = config.getHost();
                    const mochaFilePath = util_1.uri2path(mochaDeclarationFileUri);
                    assert.includeMembers(host.getScriptFileNames(), [mochaFilePath]);
                }));
            });
            describe('getPackageName()', () => {
                beforeEach(() => __awaiter(this, void 0, void 0, function* () {
                    const rootPath = util_1.uri2path(rootUri);
                    memfs = new memfs_1.InMemoryFileSystem(rootPath);
                    const localfs = new fs_helpers_1.MapFileSystem(new Map([
                        [rootUri + 'package.json', '{"name": "package-name-1"}'],
                        [rootUri + 'subdirectory-with-tsconfig/package.json', '{"name": "package-name-2"}'],
                        [rootUri + 'subdirectory-with-tsconfig/src/tsconfig.json', '{}'],
                        [rootUri + 'subdirectory-with-tsconfig/src/dummy.ts', ''],
                    ]));
                    const updater = new fs_1.FileSystemUpdater(localfs, memfs);
                    projectManager = new project_manager_1.ProjectManager(rootPath, memfs, updater, true);
                    yield projectManager.ensureAllFiles().toPromise();
                }));
            });
            describe('ensureReferencedFiles()', () => {
                beforeEach(() => {
                    const rootPath = util_1.uri2path(rootUri);
                    memfs = new memfs_1.InMemoryFileSystem(rootPath);
                    const localfs = new fs_helpers_1.MapFileSystem(new Map([
                        [rootUri + 'package.json', '{"name": "package-name-1"}'],
                        [
                            rootUri + 'node_modules/somelib/index.js',
                            '/// <reference path="./pathref.d.ts"/>\n/// <reference types="node"/>',
                        ],
                        [rootUri + 'node_modules/somelib/pathref.d.ts', ''],
                        [rootUri + 'node_modules/%40types/node/index.d.ts', ''],
                        [rootUri + 'src/dummy.ts', 'import * as somelib from "somelib";'],
                    ]));
                    const updater = new fs_1.FileSystemUpdater(localfs, memfs);
                    projectManager = new project_manager_1.ProjectManager(rootPath, memfs, updater, true);
                });
                it('should ensure content for imports and references is fetched', () => __awaiter(this, void 0, void 0, function* () {
                    yield projectManager.ensureReferencedFiles(rootUri + 'src/dummy.ts').toPromise();
                    memfs.getContent(rootUri + 'node_modules/somelib/index.js');
                    memfs.getContent(rootUri + 'node_modules/somelib/pathref.d.ts');
                    memfs.getContent(rootUri + 'node_modules/%40types/node/index.d.ts');
                }));
            });
            describe('getConfiguration()', () => {
                beforeEach(() => __awaiter(this, void 0, void 0, function* () {
                    const rootPath = util_1.uri2path(rootUri);
                    memfs = new memfs_1.InMemoryFileSystem(rootPath);
                    const localfs = new fs_helpers_1.MapFileSystem(new Map([[rootUri + 'tsconfig.json', '{}'], [rootUri + 'src/jsconfig.json', '{}']]));
                    const updater = new fs_1.FileSystemUpdater(localfs, memfs);
                    projectManager = new project_manager_1.ProjectManager(rootPath, memfs, updater, true);
                    yield projectManager.ensureAllFiles().toPromise();
                }));
                it('should resolve best configuration based on file name', () => {
                    const jsConfig = projectManager.getConfiguration(util_1.uri2path(rootUri + 'src/foo.js'));
                    const tsConfig = projectManager.getConfiguration(util_1.uri2path(rootUri + 'src/foo.ts'));
                    assert.equal(util_1.uri2path(rootUri + 'tsconfig.json'), tsConfig.configFilePath);
                    assert.equal(util_1.uri2path(rootUri + 'src/jsconfig.json'), jsConfig.configFilePath);
                    assert.equal(Array.from(projectManager.configurations()).length, 2);
                });
            });
            describe('getParentConfiguration()', () => {
                beforeEach(() => __awaiter(this, void 0, void 0, function* () {
                    const rootPath = util_1.uri2path(rootUri);
                    memfs = new memfs_1.InMemoryFileSystem(rootPath);
                    const localfs = new fs_helpers_1.MapFileSystem(new Map([[rootUri + 'tsconfig.json', '{}'], [rootUri + 'src/jsconfig.json', '{}']]));
                    const updater = new fs_1.FileSystemUpdater(localfs, memfs);
                    projectManager = new project_manager_1.ProjectManager(rootPath, memfs, updater, true);
                    yield projectManager.ensureAllFiles().toPromise();
                }));
                it('should resolve best configuration based on file name', () => {
                    const config = projectManager.getParentConfiguration(rootUri + 'src/foo.ts');
                    assert.isDefined(config);
                    assert.equal(util_1.uri2path(rootUri + 'tsconfig.json'), config.configFilePath);
                    assert.equal(Array.from(projectManager.configurations()).length, 2);
                });
            });
            describe('getChildConfigurations()', () => {
                beforeEach(() => __awaiter(this, void 0, void 0, function* () {
                    const rootPath = util_1.uri2path(rootUri);
                    memfs = new memfs_1.InMemoryFileSystem(rootPath);
                    const localfs = new fs_helpers_1.MapFileSystem(new Map([
                        [rootUri + 'tsconfig.json', '{}'],
                        [rootUri + 'foo/bar/tsconfig.json', '{}'],
                        [rootUri + 'foo/baz/tsconfig.json', '{}'],
                    ]));
                    const updater = new fs_1.FileSystemUpdater(localfs, memfs);
                    projectManager = new project_manager_1.ProjectManager(rootPath, memfs, updater, true);
                    yield projectManager.ensureAllFiles().toPromise();
                }));
                it('should resolve best configuration based on file name', () => {
                    const configs = Array.from(projectManager.getChildConfigurations(rootUri + 'foo')).map(config => config.configFilePath);
                    assert.deepEqual(configs, [
                        util_1.uri2path(rootUri + 'foo/bar/tsconfig.json'),
                        util_1.uri2path(rootUri + 'foo/baz/tsconfig.json'),
                    ]);
                    assert.equal(Array.from(projectManager.configurations()).length, 4);
                });
            });
        });
    }
});
//# sourceMappingURL=project-manager.test.js.map