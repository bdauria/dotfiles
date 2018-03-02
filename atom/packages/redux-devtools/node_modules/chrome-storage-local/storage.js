var storage;

function noop() {}

function getStorage() {
  try {
    return window.localStorage;
  } catch(e) {
    return {
      getItem: noop,
      setItem: noop,
      removeItem: noop,
      getAllKeys: noop
    };
  }
}

if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
  storage = { isChromeStorage: true };

  storage.getItem = function (key, callback) {
    chrome.storage.local.get(key, function (obj) {
      if (obj[key]) callback(null, obj[key]);
      else callback(chrome.runtime.lastError, null);
    });
  };

  storage.setItem = function (key, value, callback) {
    var obj = {};
    obj[key] = value;
    chrome.storage.local.set(obj, function () {
      if (callback && chrome.runtime.lastError) callback(key);
    });
  };

  storage.removeItem = function(key) {
    chrome.storage.local.remove(key);
  };
  
  storage.getAllKeys = function (callback) {
    chrome.storage.local.get(null, function (obj) {
      callback(null, Object.keys(obj));
    });
  };
}
else storage = getStorage(); 

module.exports = storage;
