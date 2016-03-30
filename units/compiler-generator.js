
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
var util = require('../units/util.js');

exports.injectCompilerInterfaceSpecs = function (generator) {
    it('should include extra compiler flags', function () {
        var compilerCommand = generator({
            type: 'application',
            file: 'file.c',
            flags: '--some-compiler-flag'
        });

        compilerCommand.should.containEql('--some-compiler-flag');
    });

    it('should take a path as file', function () {
        var compilerCommand = generator({
            type: 'application',
            file: './some/path/to/file.c'
        });

        compilerCommand.should.match(/\.[\/\\]some[\/\\]path[\/\\]to[\/\\]file\.c/);
    });
};

exports.injectLinkerInterfaceSpecs = function (generator) {
    it('should include extra linker flags', function () {
        var linkerCommand = generator({
            type: 'application',
            objectFiles: [
                'file.obj'
            ],
            outputName: 'name',
            flags: '--some-linker-flag'
        });

        linkerCommand.should.containEql('--some-linker-flag');
    });

    describe('outputPath', function () {
        it('should be prepended to outputName if given', function () {
            var linkerCommand = generator({
                type: 'application',
                objectFiles: [
                    'file.obj'
                ],
                outputName: 'name',
                outputPath: 'some/directory'
            });

            linkerCommand.should.containEql('some/directory/name');
        });

        it('should handle trailing slashes', function () {
            var linkerCommand = generator({
                type: 'application',
                objectFiles: [
                    'file.obj'
                ],
                outputName: 'name',
                outputPath: 'some/directory/'
            });

            linkerCommand.should.containEql('some/directory/name');
        });
    });
};
