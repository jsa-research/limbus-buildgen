
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014 by Jesper Oskarsson jesosk@gmail.com
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

exports.snakeCase = function (string) {
    return string.replace(/([a-z])([A-Z])/, function (match, lower, upper) {
        return lower + '_' + upper.toLowerCase();
    }).toLowerCase();
};
