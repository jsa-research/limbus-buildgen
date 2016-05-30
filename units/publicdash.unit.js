
// publicdash.js - Javascript functional utilities in the public domain.
// Written in 2015-2016 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

'use strict';

require('should');
var dash = require('../source/publicdash');

describe('_', function () {
    describe('map', function () {
        var timesThree = function (value) {
            return value * 3;
        };

        it('should return {} given an empty map and \\item -> item * 3', function () {
            dash.map({}, timesThree).should.match({});
        });

        it('should return {first: "3first", second: "6second"} given {first: 1, second: 2} and \\item key -> (item * 3) + key', function () {
            dash.map({ first: 1, second: 2 }, function (item, key) {
                return item * 3 + key;
            }).should.match({ first: '3first', second: '6second' });
        });

        it('should return [] given an empty array and \\item -> item * 3', function () {
            var result = dash.map([], timesThree);
            Array.isArray(result).should.be.true();
            result.should.match([]);
        });

        it('should return [0, 2, 6] given [1, 2, 3] and \\item index -> item * index', function () {
            dash.map([1, 2, 3], function (item, index) {
                return item * index;
            }).should.match([0, 2, 6]);
        });
    });

    describe('reduce', function () {
        var sumArguments = function (accumulator, item, key) {
            return accumulator + item + key;
        };

        it('should return "" given {}, (\\accumulator item key -> accumulator + item + key) and ""', function () {
            dash.reduce({}, sumArguments, '').should.equal('');
        });

        it('should return "1first2second" given {first: 1, second: 2}, (\\accumulator item key -> accumulator + item + key) and ""', function () {
            dash.reduce({ first: 1, second: 2 }, sumArguments, '').should.equal('1first2second');
        });

        it('should return "" given [], (\\accumulator item key -> accumulator + item + index) and ""', function () {
            dash.reduce([], sumArguments, '').should.equal('');
        });

        it('should return "1021" given [1, 2], (\\accumulator item key -> accumulator + item + index) and ""', function () {
            dash.reduce([1, 2], sumArguments, '').should.equal('1021');
        });
    });

    describe('filter', function () {
        it('should return [] given [] and \\item index -> true', function () {
            dash.filter([], function () {
                return true;
            }).should.match([]);
        });
        it('should return [1, 3] given [1, 2, 3] and \\item index -> index !== 1', function () {
            dash.filter([1, 2, 3], function (item, index) {
                return index !== 1;
            }).should.match([1, 3]);
        });
        it('should return {} given {} and \\item key -> true', function () {
            var result = dash.filter({}, function () {
                return true;
            });
            Array.isArray(result).should.be.false();
            result.should.match({});
        });
    });

    describe('snakeCase', function () {
        it('should return "" given ""', function () {
            dash.snakeCase('').should.equal('');
        });

        it('should return "snake" given "snake"', function () {
            dash.snakeCase('snake').should.equal('snake');
        });

        it('should return "snake" given "Snake"', function () {
            dash.snakeCase('Snake').should.equal('snake');
        });

        it('should return "snake_case" given "snakeCase"', function () {
            dash.snakeCase('snakeCase').should.equal('snake_case');
        });

        it('should return "snake_case" given "SnakeCase"', function () {
            dash.snakeCase('SnakeCase').should.equal('snake_case');
        });
    });

    describe('isNull', function () {
        it('should return true if given null', function () {
            dash.isNull(null).should.be.true();
        });

        it('should return false if given any other value', function () {
            dash.isNull(undefined).should.be.false();
            dash.isNull(0).should.be.false();
            dash.isNull([]).should.be.false();
            dash.isNull({}).should.be.false();
        });
    });

    describe('negate', function () {
        it('should return true if given a falsy value', function () {
            dash.negate(false).should.be.true();
            dash.negate(null).should.be.true();
            dash.negate(undefined).should.be.true();
            dash.negate(0).should.be.true();
            dash.negate(NaN).should.be.true();
        });
        it('should return false if given a truthy value', function () {
            dash.negate(true).should.be.false();
            dash.negate(1).should.be.false();
            dash.negate([]).should.be.false();
            dash.negate({}).should.be.false();
        });
    });

    describe('compose', function () {
        it('should return a function equal to a(b(x)) given a(x) and b(y)', function () {
            var first = function (value) {
                return value * 3;
            };
            var second = function (value) {
                return value + 2;
            };

            dash.compose(first, second)(5).should.equal(21);
            dash.compose(first, second)(3).should.equal(15);
        });
    });
});
