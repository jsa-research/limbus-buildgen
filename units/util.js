
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

var _ = require('../source/underscore');

var should_throw_type_error = function (permutations, errorSuffix, generator, baseOptions, option, error) {
    permutations.forEach(function (permutationToTry) {
        baseOptions[option] = permutationToTry;
        (function () { generator(baseOptions); }).should.throw(_.camelToSnakeCase(option) + errorSuffix);
    });
};

exports.should_throw_not_string_array_error = function (generator, baseOptions, option, error) {
    var permutations = [
        ['', 1],
        ['', {}],
        ['', null],
        ['', NaN],
        ['', []],
        {},
        1,
        '',
        null,
        NaN
    ];
    should_throw_type_error(permutations, '_is_not_a_string_array', generator, baseOptions, option, error);
};

exports.should_throw_not_string_error = function (generator, baseOptions, option, error) {
    var permutations = [
        [], {}, 1, NaN, null
    ];
    should_throw_type_error(permutations, '_is_not_a_string', generator, baseOptions, option, error);
};
