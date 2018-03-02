/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule RelayContainerUtils
 * 
 * @format
 */

'use strict';

/**
 * @internal
 *
 * Helper for checking if this is a React Component
 * created with React.Component or React.createClass().
 */

function isReactComponent(component) {
  return !!(component && typeof component.prototype === 'object' && component.prototype && component.prototype.isReactComponent);
}

function getReactComponent(Component) {
  if (isReactComponent(Component)) {
    return Component;
  } else {
    return null;
  }
}

function getComponentName(Component) {
  var name = void 0;
  var ComponentClass = getReactComponent(Component);
  if (ComponentClass) {
    name = ComponentClass.displayName || ComponentClass.name;
  } else if (typeof Component === 'function') {
    // This is a stateless functional component.
    name = Component.displayName || Component.name || 'StatelessComponent';
  } else {
    name = 'ReactElement';
  }
  return String(name);
}

function getContainerName(Component) {
  return 'Relay(' + getComponentName(Component) + ')';
}

module.exports = {
  getComponentName: getComponentName,
  getContainerName: getContainerName,
  getReactComponent: getReactComponent
};