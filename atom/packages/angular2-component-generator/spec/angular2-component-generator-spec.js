'use babel';

import Angular2ComponentGenerator from '../lib/angular2-component-generator';

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('Angular2ComponentGenerator', () => {
  let workspaceElement, activationPromise;

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('angular2-component-generator');
  });

  describe('when the angular2-component-generator:toggle event is triggered', () => {
    it('hides and shows the modal panel', () => {
      // Before the activation event the view is not on the DOM, and no panel
      // has been created
      expect(workspaceElement.querySelector('.angular2-component-generator')).not.toExist();

      // This is an activation event, triggering it will cause the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'angular2-component-generator:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        expect(workspaceElement.querySelector('.angular2-component-generator')).toExist();

        let angular2ComponentGeneratorElement = workspaceElement.querySelector('.angular2-component-generator');
        expect(angular2ComponentGeneratorElement).toExist();

        let angular2ComponentGeneratorPanel = atom.workspace.panelForItem(angular2ComponentGeneratorElement);
        expect(angular2ComponentGeneratorPanel.isVisible()).toBe(true);
        atom.commands.dispatch(workspaceElement, 'angular2-component-generator:toggle');
        expect(angular2ComponentGeneratorPanel.isVisible()).toBe(false);
      });
    });

    it('hides and shows the view', () => {
      // This test shows you an integration test testing at the view level.

      // Attaching the workspaceElement to the DOM is required to allow the
      // `toBeVisible()` matchers to work. Anything testing visibility or focus
      // requires that the workspaceElement is on the DOM. Tests that attach the
      // workspaceElement to the DOM are generally slower than those off DOM.
      jasmine.attachToDOM(workspaceElement);

      expect(workspaceElement.querySelector('.angular2-component-generator')).not.toExist();

      // This is an activation event, triggering it causes the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'angular2-component-generator:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        // Now we can test for view visibility
        let angular2ComponentGeneratorElement = workspaceElement.querySelector('.angular2-component-generator');
        expect(angular2ComponentGeneratorElement).toBeVisible();
        atom.commands.dispatch(workspaceElement, 'angular2-component-generator:toggle');
        expect(angular2ComponentGeneratorElement).not.toBeVisible();
      });
    });
  });
});
