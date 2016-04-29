
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014-2016 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

var should = require('should');
var MakefileBuilder = require('../source/makefile-builder');

describe('makefile-builder', function () {
    describe('build', function () {
        it('should return an empty makefile given an empty array', function () {
            var makefile = MakefileBuilder.build([]);
            makefile.should.equal('');
        });

        it('should generate an empty target', function () {
            var makefile = MakefileBuilder.build([{name: 'all', commands: []}]);
            makefile.should.equal('all:' +
                                  '\n\t' +
                                  '\n');
        });

        it('should generate a target with commands', function () {
            var makefile = MakefileBuilder.build([{name: 'all', commands: ["gcc -c test.c"]}]);
            makefile.should.equal('all:' +
                                  '\n\tgcc -c test.c' +
                                  '\n');
        });

        it('should generate a target with dependencies', function () {
            var makefile = MakefileBuilder.build([
                {name: 'other_target', commands: ["gcc -c other.c"]},
                {name: 'all', commands: ["gcc -o test test.c other.o"]},
            ]);
            makefile.should.equal(
                'all: other_target' +
                '\n\tgcc -o test test.c other.o\n' +
                'other_target:' +
                '\n\tgcc -c other.c' +
                '\n'
            );
        });

        it('should always name the last target "all"', function () {
            var makefile = MakefileBuilder.build([
                {name: 'other_target', commands: ["echo"]},
                {name: 'last', commands: ["echo"]},
            ]);
            makefile.should.equal(
                'all: other_target' +
                '\n\techo\n' +
                'other_target:' +
                '\n\techo' +
                '\n'
            );
        });
    });
});
