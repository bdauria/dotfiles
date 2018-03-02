/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule filterRelayQuery
 * 
 * @format
 */

'use strict';

/**
 * @internal
 *
 * `filterRelayQuery` filters query nodes for which `callback` returns false.
 * This is intended as a generic filter module and therefore contains no special
 * logic for handling requisite or generated fields.
 */
function filterRelayQuery(node, callback) {
  if (callback(node)) {
    return node.clone(node.getChildren().map(function (child) {
      return filterRelayQuery(child, callback);
    }));
  }
  return null;
}

module.exports = filterRelayQuery;