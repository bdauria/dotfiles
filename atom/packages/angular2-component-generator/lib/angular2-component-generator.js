'use babel';

// import Angular2ComponentGeneratorView from './angular2-component-generator-view';
import { CompositeDisposable } from 'atom';
import * as fse from 'fs-extra';
import * as path from 'path';
import * as fs from 'fs';
import * as changeCase from 'change-case';
import { Observable } from 'rxjs';

import { FileHelper } from './FileHelper';
Dialog = require ('./Dialog');

export default {

  angular2ComponentGeneratorView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    let self = this;
    // this.angular2ComponentGeneratorView = new Angular2ComponentGeneratorView(state.angular2ComponentGeneratorViewState);

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'angular2-component-generator:toggle': event => this.toggle(event)
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {
    return {
      // angular2ComponentGeneratorViewState: this.angular2ComponentGeneratorView.serialize()
    };
  },

  toggle(event) {

    this.dialog = new Dialog({
        prompt: 'Please enter component name in camelCase'
    })

    let uri;
    if(event.target.localName === "span") {
        // file clicked
        uri =  event.target.getAttribute("data-path");
    } else {
        // folder clicked
        uri =  event.target.firstChild.getAttribute("data-path");
    }

    FileHelper.atom = atom;

    // read atom config
    let config = atom.config.get("ng2ComponentGenerator");
    if(!config) {
      // if config is not specified by user -> read default extension config
      config = FileHelper.getConfig();
    }

    if(atom.workspace.project.rootDirectories.length === 0) {
        atom.notifications.addError('Project is not selected! Please select one :)');
        return;
    }

    createComponent = function (path, inputName) {
      Observable.from([inputName])
        .concatMap( val => {
                if (val.length === 0) {
                    throw new Error('Component name can not be empty!');
                }
                let componentName = changeCase.paramCase(val);
                let componentDir = FileHelper.createComponentDir(uri, componentName);

                return Observable.forkJoin(
                    FileHelper.createComponent(componentDir, componentName, config.files.component),
                    FileHelper.createHtml(componentDir, componentName, config.files.html),
                    FileHelper.createCss(componentDir, componentName, config.files.css),
                    FileHelper.createModule(componentDir, componentName, config.files.module)
                );
            }
        )
        .concatMap(result => Observable.from(result))
        .filter(path => path.length > 0)
        .first()
        .concatMap(filename => Observable.from(atom.workspace.open(filename)))
        .subscribe(
            () => atom.notifications.addSuccess('Component Successfuly Created!'),
            err => atom.notifications.addError(err.message)
        );

    }

    this.dialog.callback = (value) => {
      self.createComponent(uri, value);
    }

    return (this.dialog.attach());
  }

};
