
// publicdash.js - Javascript functional utilities in the public domain.
// Written in 2015 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

var mapHashmap = function (hashmap, func) {
    var newHashmap = {};
    for (var key in hashmap) {
        var item = hashmap[key];
        newHashmap[key] = func(item, key);
    }
    return newHashmap;
};

var mapArray = function (array, func) {
    var newArray = [];
    for (var i = 0; i < array.length; ++i) {
        var item = array[i];
        newArray[i] = func(item, i);
    }
    return newArray;
};

exports.map = function (collection, func) {
    if (Array.isArray(collection)) {
        return mapArray.apply(this, arguments);
    } else {
        return mapHashmap.apply(this, arguments);
    }
};

exports.reduce = function (collection, func, accumulator) {
    for (var key in collection) {
        var item = collection[key];
        accumulator = func(accumulator, item, key);
    }
    return accumulator;
};

var filterArray = function (array, func) {
    var newArray = [];
    for (var i = 0; i < array.length; ++i) {
        var value = array[i];
        if (func(value, i)) {
            newArray.push(value);
        }
    }
    return newArray;
};

var filterMap = function (hashmap, func) {
    var newHashmap = {};
    for (var key in hashmap) {
        var value = hashmap[key];
        if (func(value, key)) {
            newHashmap[key] = value;
        }
    }
    return newHashmap;
};

exports.filter = function (collection, func) {
    if (Array.isArray(collection)) {
        return filterArray.apply(this, arguments);
    } else {
        return filterMap.apply(this, arguments);
    }
};

exports.snakeCase = function (string) {
    return string.replace(/([a-z])([A-Z])/, function (match, lower, upper) {
        return lower + '_' + upper.toLowerCase();
    }).toLowerCase();
};

exports.compose = function (a, b) {
    return function (x) {
        return a(b(x));
    };
};

exports.not = {};
exports.negate = function (value) {
    return !value;
};

exports.isNull = function (value) {
    return value === null;
};
exports.not.isNull = exports.compose(exports.negate, exports.isNull);
