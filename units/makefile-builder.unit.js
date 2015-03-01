
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
var MakefileBuilder = require('../source/makefile-builder');

describe('makefile-builder', function () {
    describe('build', function () {
        it('should return an empty makefile given an empty map', function () {
            var makefile = MakefileBuilder.build({});
            makefile.should.equal('');
        });

        it('should return a makefile with an empty target named "all" if given "{ all: [] }"', function () {
            var makefile = MakefileBuilder.build({ all: [] });
            makefile.should.equal('all:' +
                                  '\n\t' +
                                  '\n');
        });

        it('should return a makefile with a target named "all" with command "gcc -c test.c" if given "{ all: ["gcc -c test.c"] }"', function () {
            var makefile = MakefileBuilder.build({ all: ["gcc -c test.c"] });
            makefile.should.equal('all:' +
                                  '\n\tgcc -c test.c' +
                                  '\n');
        });
    });
});
