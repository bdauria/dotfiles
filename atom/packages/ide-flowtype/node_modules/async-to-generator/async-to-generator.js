'use strict';

exports.__esModule = true;

exports.default = function(fn) {
  return function() {
    var gen = fn.apply(this, arguments);
    return new Promise(function(resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }
        if (info.done) {
          resolve(value);
        } else {
          Promise.resolve(value).then(_next, _throw);
        }
      }
      function _next(value) {
        step('next', value);
      }
      function _throw(err) {
        step('throw', err);
      }
      step('next');
    });
  };
};
