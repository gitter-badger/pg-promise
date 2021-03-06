'use strict';

var PromiseAdapter = require('./adapter');

//////////////////////////////////////////
// Parses and validates a promise library;
function parsePromiseLib(pl) {

    var promise;
    if (pl instanceof PromiseAdapter) {
        promise = function (func) {
            return pl.create(func);
        };
        promise.resolve = pl.resolve;
        promise.reject = pl.reject;
        return promise;
    }
    var t = typeof pl;
    if (t === 'function' || t === 'object') {
        var root = pl.Promise instanceof Function ? pl.Promise : pl;
        promise = function (func) {
            return new root(func);
        };
        promise.resolve = root.resolve;
        promise.reject = root.reject;
        if (promise.resolve instanceof Function && promise.reject instanceof Function) {
            return promise;
        }
    }

    throw new TypeError("Invalid promise library specified.");
}

function init(promiseLib) {

    init.promiseLib = promiseLib;

    if (promiseLib) {
        init.p = parsePromiseLib(promiseLib);
    } else {
        // istanbul ignore if
        // Excluding from coverage, because it is
        // only triggered for NodeJS prior to 0.12
        if (typeof Promise === 'undefined') {
            // ES6 Promise isn't supported, NodeJS is pre-0.12;
            throw new TypeError("Promise library must be specified.");
        }
        init.p = parsePromiseLib(Promise);
        init.promiseLib = Promise;
    }

}

module.exports = init;
