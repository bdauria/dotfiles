/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule filterExclusiveKeys
 * 
 * @format
 */

'use strict';

var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Returns two arrays of keys that contain each object's exclusive keys.
 */
function filterExclusiveKeys(a, b) {
  var keysA = a ? Object.keys(a) : [];
  var keysB = b ? Object.keys(b) : [];

  if (keysA.length === 0 || keysB.length === 0) {
    return [keysA, keysB];
  }
  return [keysA.filter(function (key) {
    return !hasOwnProperty.call(b, key);
  }), keysB.filter(function (key) {
    return !hasOwnProperty.call(a, key);
  })];
}

module.exports = filterExclusiveKeys;