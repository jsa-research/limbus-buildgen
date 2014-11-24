
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

exports.map = function (list, applyFunction) {
    var newList = [];
    list.forEach(function (item, index) {
        newList[index] = applyFunction(item);
    });
    return newList;
};

exports.camelToSnakeCase = function (input) {
    return input.replace(/([a-z])([A-Z])/g, function (match, a, b) {
        return a + '_' + b.toLowerCase();
    });
};
