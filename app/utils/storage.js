var serializedPrefix = '_object:';

var setItem = (k,v) => window.localStorage.setItem(k,v);
var getItem = (v) => window.localStorage.getItem(v);
var removeItem = (v) => window.localStorage.removeItem(v);

var storage = {};

// memory-based local storage shim
var defaultSetItem = (k,v) => storage[k] = v;
var defaultGetItem = (v) => storage[v];
var defaultRemoveItem = (v) => delete storage[v];

function checkLocalStorage(){
  try {
    window.localStorage.setItem('_test',true);
    return true;
  } catch(e) {
    return false;
  }
}

if (!checkLocalStorage()) {
  setItem    = defaultSetItem;
  getItem    = defaultGetItem;
  removeItem = defaultRemoveItem;
}

export function write(key, value) {
  var serialized;
  if (typeof value === 'object') {
    serialized = serializedPrefix+JSON.stringify(value);
  } else {
    serialized = value;
  }
  return setItem(key, serialized);
}

export function read(key) {
  var serialized = getItem(key);
  var value;
  if (typeof serialized === 'string' && serialized.indexOf(serializedPrefix) === 0){
    value = JSON.parse(serialized.slice(8));
  } else {
    value = serialized;
  }
  return value;
}

export function remove(key) {
  return removeItem(key);
}

export default {
  write:  write,
  read:   read,
  remove: remove
};
