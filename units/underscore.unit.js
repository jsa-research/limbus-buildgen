
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

var should = require('should');
var _ = require('../source/underscore');

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
});
