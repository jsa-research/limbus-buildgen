
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
var ClCompilerGenerator = require('../source/cl-compiler-generator');
var CompilerGenerator = require('../units/compiler-generator');

describe('cl-compiler-generator', function () {
    describe('Compiling', function () {
        it('should compile a file into an object file with the same name', function () {
            var compilerCommand = ClCompilerGenerator.compilerCommand({
                file: 'test.c'
            });

            compilerCommand.should.match(/^cl \/c /);
            compilerCommand.should.containEql('test.c');
            compilerCommand.should.containEql('/Fetest.obj');

            var compilerCommand = ClCompilerGenerator.compilerCommand({
                file: 'anotherFile.c'
            });

            compilerCommand.should.containEql('anotherFile.c');
            compilerCommand.should.containEql('/FeanotherFile.obj');
        });

        it('should add any specified include paths in includePaths', function () {
            var compilerCommand = ClCompilerGenerator.compilerCommand({
                file: 'test.c',
                includePaths: [
                    'include_path',
                    'other_path'
                ]
            });

            compilerCommand.should.match(/\/Iinclude_path/);
            compilerCommand.should.match(/\/Iother_path/);
        });

        it('should convert paths to use backslashes instead of forward ones', function () {
            var compilerCommand = ClCompilerGenerator.compilerCommand({
                file: 'in/some/path/test.c',
                includePaths: [
                    'some/include/path'
                ]
            });

            compilerCommand.should.match(/some\\include\\path/);
            compilerCommand.should.match(/in\\some\\path\\test.c/);
            compilerCommand.should.match(/in\\some\\path\\test.obj/);
        });

        CompilerGenerator.injectCompilerInterfaceSpecs(ClCompilerGenerator.compilerCommand);
    });

    describe('Linking', function () {
        it('should link several object files into one executable with outputName', function () {
            var linkerCommand = ClCompilerGenerator.linkerCommand({
                objectFiles: [
                    'filea.obj',
                    'fileb.obj'
                ],
                outputName: 'executable',
                type: 'application'
            });

            linkerCommand.should.match(/^cl /);
            linkerCommand.should.containEql('filea.obj');
            linkerCommand.should.containEql('fileb.obj');
            linkerCommand.should.containEql('/Feexecutable');
        });

        it('should link with any specified libraries in libraries', function () {
            var linkerCommand = ClCompilerGenerator.linkerCommand({
                objectFiles: [
                    'file.obj'
                ],
                libraries: [
                    'mylibrary',
                    'anotherlibrary'
                ],
                outputName: 'executable',
                type: 'application'
            });

            linkerCommand.should.containEql('mylibrary.lib');
            linkerCommand.should.containEql('anotherlibrary.lib');
        });

        it('should convert paths to use backslashes instead of forward ones', function () {
            var linkerCommand = ClCompilerGenerator.linkerCommand({
                objectFiles: [
                    'object/file/in/a/path.obj'
                ],
                outputName: 'does_not_have_a_path',
                type: 'application'
            });

            linkerCommand.should.match(/object\\file\\in\\a\\path.obj/);
        });

        it('should link as a static library if "type" === "static-library"', function () {
            var linkerCommand = ClCompilerGenerator.linkerCommand({
                objectFiles: [
                    'file.obj'
                ],
                outputName: 'name',
                type: 'static-library'
            });

            linkerCommand.should.match(/^lib \/OUT:name\.lib/);
        });

        CompilerGenerator.injectLinkerInterfaceSpecs(ClCompilerGenerator.linkerCommand);
    });
});
