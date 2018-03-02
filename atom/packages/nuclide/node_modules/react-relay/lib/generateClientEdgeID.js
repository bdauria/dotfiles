/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule generateClientEdgeID
 * 
 * @format
 */

'use strict';

/**
 * Generate an edge client id for edges on connections based on the range it
 * belongs to and the node it contains.
 *
 * @internal
 */

function generateClientEdgeID(rangeID, nodeID) {
  return 'client:' + rangeID + ':' + nodeID;
}

module.exports = generateClientEdgeID;