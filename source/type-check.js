
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

var _ = require('./underscore');

exports.string = function (object, property, required) {
    var not_string_error = _.snakeCase(property) + '_is_not_a_string';
    var value = object[property];
    if (required) {
        if (value === undefined) {
            throw new Error('no_' + _.snakeCase(property));
        }
    }

    if (value !== undefined && typeof value !== 'string') {
        throw new Error(not_string_error);
    }
};

exports.stringArray = function (object, property, required) {
    var not_string_array_error = _.snakeCase(property) + '_is_not_a_string_array';
    var value = object[property];
    if (value !== undefined && !Array.isArray(value)) {
        throw new Error(not_string_array_error);
    }
    if (required) {
        if (value === undefined || value.length === 0) {
            throw new Error('no_' + _.snakeCase(property));
        }
    }
    if (value !== undefined) {
        value.forEach(function (file) {
            if (typeof file !== 'string') {
                throw new Error(not_string_array_error);
            }
        });
    }
};
