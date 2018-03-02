"use strict";
var fse = require('fs-extra');
var fs = require('fs');
var path = require('path');
var changeCase = require('change-case');
var rxjs_1 = require('rxjs');
var FileHelper = (function () {
    function FileHelper() {
    }
    FileHelper.createComponent = function (componentDir, componentName, config) {
        var templateFileName = this.assetRootDir + '/templates/component.template';
        if (config.template) {
            templateFileName = this.resolveWorkspaceRoot(config.template);
        }
        var componentContent = fs.readFileSync(templateFileName).toString()
            .replace(/{selector}/g, componentName)
            .replace(/{templateUrl}/g, componentName + ".component.html")
            .replace(/{styleUrls}/g, componentName + ".component.css")
            .replace(/{className}/g, changeCase.pascalCase(componentName));
        var filename = componentDir + "/" + componentName + ".component." + config.extension;
        if (config.create) {
            return this.createFile(filename, componentContent)
                .map(function (result) { return filename; });
        }
        else {
            return rxjs_1.Observable.of('');
        }
    };
    ;
    FileHelper.createModule = function (componentDir, componentName, config) {
        var templateFileName = this.assetRootDir + '/templates/module.template';
        if (config.template) {
            templateFileName = this.resolveWorkspaceRoot(config.template);
        }
        var moduleContent = fs.readFileSync(templateFileName).toString()
            .replace(/{componentName}/g, componentName)
            .replace(/{className}/g, changeCase.pascalCase(componentName));
        var filename = componentDir + "/" + componentName + ".module." + config.extension;
        if (config.create) {
            return this.createFile(filename, moduleContent)
                .map(function (result) { return filename; });
        }
        else {
            return rxjs_1.Observable.of('');
        }
    };
    ;
    FileHelper.createHtml = function (componentDir, componentName, config) {
        var templateFileName = this.assetRootDir + '/templates/html.template';
        if (config.template) {
            templateFileName = this.resolveWorkspaceRoot(config.template);
        }
        var htmlContent = fs.readFileSync(templateFileName).toString();
        var filename = componentDir + "/" + componentName + ".component." + config.extension;
        if (config.create) {
            return this.createFile(filename, htmlContent)
                .map(function (result) { return filename; });
        }
        else {
            return rxjs_1.Observable.of('');
        }
    };
    ;
    FileHelper.createCss = function (componentDir, componentName, config) {
        var templateFileName = this.assetRootDir + '/templates/css.template';
        if (config.template) {
            templateFileName = this.resolveWorkspaceRoot(config.template);
        }
        var cssContent = fs.readFileSync(templateFileName).toString();
        var filename = componentDir + "/" + componentName + ".component." + config.extension;
        if (config.create) {
            return this.createFile(filename, cssContent)
                .map(function (result) { return filename; });
        }
        else {
            return rxjs_1.Observable.of('');
        }
    };
    ;
    FileHelper.createComponentDir = function (uri, componentName) {
        var contextMenuSourcePath;
        if (uri && fs.lstatSync(uri).isDirectory()) {
            contextMenuSourcePath = uri;
        }
        else if (uri) {
            contextMenuSourcePath = path.dirname(uri);
        }
        else {
            contextMenuSourcePath = this.atom.workspace.project.rootDirectories[0].path;
        }
        var componentDir = contextMenuSourcePath + "/" + componentName;
        fse.mkdirsSync(componentDir);
        return componentDir;
    };
    FileHelper.getConfig = function () {
        var content = fs.readFileSync(this.assetRootDir + '/config/config.json').toString();
        content = content.replace(/\${workspaceRoot}/g, this.atom.workspace.project.rootDirectories[0].path);
        return JSON.parse(content);
    };
    FileHelper.resolveWorkspaceRoot = function (path) {
        return path.replace('${workspaceRoot}', this.atom.workspace.project.rootDirectories[0].path);
    };
    FileHelper.createFile = rxjs_1.Observable.bindNodeCallback(fse.outputFile);
    FileHelper.assetRootDir = path.join(__dirname, '../assets');
    return FileHelper;
}());
exports.FileHelper = FileHelper;
