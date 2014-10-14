var Promise = require('bluebird')

module.exports = function(items) {
  var account = items.account;
  var instance = items.instance;
  return new Promise(function(resolve, reject) {
    console.log('self destructing');
    instance.selfDestruct();
    resolve(instance)
  });
}
