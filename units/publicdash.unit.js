
// publicdash.js - Javascript functional utilities in the public domain.
// Written in 2015-2016 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

require('should');
var _ = require('../source/publicdash');

describe('_', function () {
    describe('map', function () {
        var timesThree = function (a) { return a * 3; };

        it('should return {} given an empty map and \\item -> item * 3', function () {
            _.map({}, timesThree).should.match({});
        });

        it('should return {a: "3a", b: "6b"} given {a: 1, b: 2} and \\item key -> (item * 3) + key', function () {
            _.map({a: 1, b: 2}, function (item, key) { return (item * 3) + key; }).should.match({a: '3a', b: '6b'});
        });

        it('should return [] given an empty array and \\item -> item * 3', function () {
            var result = _.map([], timesThree);
            Array.isArray(result).should.be.true;
            result.should.match([]);
        });

        it('should return [0, 2, 6] given [1, 2, 3] and \\item index -> item * index', function () {
            _.map([1, 2, 3], function (item, index) { return item * index; }).should.match([0, 2, 6]);
        });
    });

    describe('reduce', function () {
        var sumArguments = function (accumulator, item, key) {
            return accumulator + item + key
        };

        it('should return "" given {}, (\\accumulator item key -> accumulator + item + key) and ""', function () {
            _.reduce({}, sumArguments, '').should.equal('');
        });

        it('should return "1a2b" given {a: 1, b: 2}, (\\accumulator item key -> accumulator + item + key) and ""', function () {
            _.reduce({a: 1, b: 2}, sumArguments, '').should.equal('1a2b');
        });

        it('should return "" given [], (\\accumulator item key -> accumulator + item + index) and ""', function () {
            _.reduce([], sumArguments, '').should.equal('');
        });

        it('should return "1021" given [1, 2], (\\accumulator item key -> accumulator + item + index) and ""', function () {
            _.reduce([1, 2], sumArguments, '').should.equal('1021');
        });
    });

    describe('filter', function () {
        it('should return [] given [] and \\item index -> true', function () {
            _.filter([], function () {
                return true;
            }).should.match([]);
        });
        it('should return [1, 3] given [1, 2, 3] and \\item index -> index !== 1', function () {
            _.filter([1, 2, 3], function (item, index) {
                return index !== 1;
            }).should.match([1, 3]);
        });
        it('should return {} given {} and \\item key -> true', function () {
            var result = _.filter({}, function () {
                return true;
            });
            Array.isArray(result).should.be.false;
            result.should.match({});
        });
        it('should return {a: 1, c: 3} given {a: 1, b: 2, c: 3} and \\item key -> key !== "b"', function () {
            _.filter({a: 1, b: 2, c: 3}, function (item, key) {
                return key !== 'b';
            }).should.match({a: 1, c: 3});
        });
    });

    describe('snakeCase', function () {
        it('should return "" given ""', function () {
            _.snakeCase('').should.equal('');
        });

        it('should return "snake" given "snake"', function () {
            _.snakeCase('snake').should.equal('snake');
        });

        it('should return "snake" given "Snake"', function () {
            _.snakeCase('Snake').should.equal('snake');
        });

        it('should return "snake_case" given "snakeCase"', function () {
            _.snakeCase('snakeCase').should.equal('snake_case');
        });

        it('should return "snake_case" given "SnakeCase"', function () {
            _.snakeCase('SnakeCase').should.equal('snake_case');
        });
    });

    describe('isNull', function () {
        it('should return true if given null', function () {
            _.isNull(null).should.be.true;
        });

        it('should return false if given any other value', function () {
            _.isNull(undefined).should.be.false;
            _.isNull(0).should.be.false;
            _.isNull([]).should.be.false;
            _.isNull({}).should.be.false;
        });
    });

    describe('negate', function () {
        it('should return true if given a falsy value', function () {
            _.negate(false).should.be.true;
            _.negate(null).should.be.true;
            _.negate(undefined).should.be.true;
            _.negate(0).should.be.true;
            _.negate(NaN).should.be.true;
        });
        it('should return false if given a truthy value', function () {
            _.negate(true).should.be.false;
            _.negate(1).should.be.false;
            _.negate([]).should.be.false;
            _.negate({}).should.be.false;
        });
    });

    describe('compose', function () {
        it('should return a function equal to a(b(x)) given a(x) and b(y)', function () {
            var a = function (x) { return x * 3; };
            var b = function (x) { return x + 2; };

            _.compose(a, b)(5).should.equal(21);
            _.compose(a, b)(3).should.equal(15);
        });
    });
});
