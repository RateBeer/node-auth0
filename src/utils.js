var Promise = require('bluebird');
var base64 = require('base-64');

/**
 * @module utils
 */
var utils = (module.exports = {});

/**
 * Given a JSON string, convert it to its base64 representation.
 *
 * @method    jsonToBase64
 * @memberOf  module:utils
 */
utils.jsonToBase64 = function (json) {
  return base64.encode(JSON.stringify(json))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

/**
 * Simple wrapper that, given a class, a property name and a method name,
 * creates a new method in the class that is a wrapper for the given
 * property method.
 *
 * @method    wrapPropertyMethod
 * @memberOf  module:utils
 */
utils.wrapPropertyMethod = function(Parent, name, propertyMethod) {
  var path = propertyMethod.split('.');
  var property = path.shift();
  var method = path.pop();

  Object.defineProperty(Parent.prototype, name, {
    enumerable: false,
    get: function() {
      return this[property][method].bind(this[property]);
    }
  });
};

/**
 * Perform a request with the given settings and return a promise that resolves
 * when the request is successfull and rejects when there's an error.
 *
 * @method    getRequestPromise
 * @memberOf  module:utils
 */
utils.getRequestPromise = function (settings) {
  return new Promise(function (resolve, reject) {
    fetch(settings.url, {
      method: settings.method,
      body: settings.data,
      headers: settings.headers
    }, function (err, res, body) {
       if (err) {
        reject(err);
        return;
      }

      resolve(res.body);
    });
  });
};
