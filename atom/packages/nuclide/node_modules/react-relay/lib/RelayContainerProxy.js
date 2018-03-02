/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule RelayContainerProxy
 * 
 * @format
 */

'use strict';

/**
 * This feature is deprecated and unavailable in open source.
 */
var RelayContainerProxy = {
  proxyMethods: function proxyMethods(Container, Component) {},
  injectProxyMethods: function injectProxyMethods(proxyMethods) {
    this.proxyMethods = proxyMethods;
  }
};

module.exports = RelayContainerProxy;