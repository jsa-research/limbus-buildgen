
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
var ClCompilerGenerator = require('../source/cl-compiler-generator');

describe('cl-compiler-generator', function () {
    describe('Compiling', function () {
        it('should compile a file into an object file with the same name', function () {
            var compilerCommand = ClCompilerGenerator.compilerCommand({
                type: 'application',
                file: 'test.c'
            });

            compilerCommand.should.match(/^cl \/c /);
            compilerCommand.should.containEql('test.c');
            compilerCommand.should.containEql('/Fotest.obj');

            var compilerCommand = ClCompilerGenerator.compilerCommand({
                type: 'application',
                file: 'anotherFile.c'
            });

            compilerCommand.should.containEql('anotherFile.c');
            compilerCommand.should.containEql('/FoanotherFile.obj');
        });

        it('should add any specified include paths in includePaths', function () {
            var compilerCommand = ClCompilerGenerator.compilerCommand({
                type: 'application',
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
                type: 'application',
                file: 'in/some/path/test.c',
                includePaths: [
                    'some/include/path'
                ]
            });

            compilerCommand.should.match(/some\\include\\path/);
            compilerCommand.should.match(/in\\some\\path\\test.c/);
            compilerCommand.should.match(/in\\some\\path\\test.obj/);
        });

        it('should compile as a dynamic library if "type" === "dynamic-library"', function () {
            var compilerCommand = ClCompilerGenerator.compilerCommand({
                type: 'dynamic-library',
                file: 'file.c'
            });

            compilerCommand.should.containEql('/D_USRDLL /D_WINDLL');
        });

        it('should include extra compiler flags', function () {
            var compilerCommand = ClCompilerGenerator.compilerCommand({
                type: 'application',
                file: 'file.c',
                flags: '/flag'
            });

            compilerCommand.should.containEql('/flag');
        });

        it('should take a path as file', function () {
            var compilerCommand = ClCompilerGenerator.compilerCommand({
                type: 'application',
                file: './some/path/to/file.c'
            });

            compilerCommand.should.match(/\.\\some\\path\\to\\file\.c/);
        });
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

        it('should convert object file paths to use backslashes instead of forward ones', function () {
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

        it('should link as a dynamic library if "type" === "dynamic-library"', function () {
            var linkerCommand = ClCompilerGenerator.linkerCommand({
                objectFiles: [
                    'file.obj'
                ],
                outputName: 'name',
                type: 'dynamic-library'
            });

            linkerCommand.should.match(/^link \/DLL \/OUT:name\.dll file\.obj/);
        });

        it('should include extra linker flags', function () {
            var linkerCommand = ClCompilerGenerator.linkerCommand({
                type: 'application',
                objectFiles: [
                    'file.obj'
                ],
                outputName: 'name',
                flags: '/flag'
            });

            linkerCommand.should.containEql('/flag');
        });

        describe('outputPath', function () {
            it('should be prepended to outputName if given', function () {
                var linkerCommand = ClCompilerGenerator.linkerCommand({
                    type: 'application',
                    objectFiles: [
                        'file.obj'
                    ],
                    outputName: 'name',
                    outputPath: 'some/directory'
                });

                linkerCommand.should.containEql('some\\directory\\name');
            });

            it('should handle trailing slashes', function () {
                var linkerCommand = ClCompilerGenerator.linkerCommand({
                    type: 'application',
                    objectFiles: [
                        'file.obj'
                    ],
                    outputName: 'name',
                    outputPath: 'some/directory/'
                });

                linkerCommand.should.containEql('some\\directory\\name');
            });
        });
    });
});
