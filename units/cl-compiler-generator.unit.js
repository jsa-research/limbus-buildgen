
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
    describe('Variables', function () {
        it('should return a dictionary with CC set to "cl"', function () {
            var variables = ClCompilerGenerator.variables({});
            variables.CC.should.equal('cl');
        });

        it('should return a dictionary with AR set to "lib"', function () {
            var variables = ClCompilerGenerator.variables({});
            variables.AR.should.equal('lib');
        });
    });

    describe('Compiling', function () {
        it('should accept files with dots in their paths', function () {
            var compilerCommand = ClCompilerGenerator.compilerCommand({
                file: 'file.with.dots.c'
            });
            compilerCommand.should.match(/file\.with\.dots\.c/);
        });

        it('should compile a file using $(CC)', function () {
            var compilerCommand = ClCompilerGenerator.compilerCommand({
                type: 'application',
                file: 'test.c'
            });

            compilerCommand.should.match(/^\$\(CC\) /);
            compilerCommand.should.containEql('/c ');
        });

        it('should compile files with /nologo', function () {
            var compilerCommand = ClCompilerGenerator.compilerCommand({
                type: 'application',
                file: 'test.c'
            });

            compilerCommand.should.containEql('/nologo');
        });

        it('should compile a file into an object file with the filename and a .obj postfix', function () {
            var compilerCommand = ClCompilerGenerator.compilerCommand({
                type: 'application',
                file: 'test.c'
            });

            compilerCommand.should.containEql('/Fotest.c.obj');
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
            compilerCommand.should.match(/in\\some\\path\\test\.c\.obj/);
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
                flags: '-flags'
            });

            compilerCommand.should.containEql(' -flags');
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
        it('should link an application if "type" === "application" using $(CC)', function () {
            var linkerCommand = ClCompilerGenerator.linkerCommand({
                type: 'application',
                outputName: 'app',
                files: ['main.c']
            });
            linkerCommand.should.match(/^\$\(CC\) /);
        });

        it('should link a static library if "type" === "dynamic-library" using $(AR)', function () {
            var linkerCommand = ClCompilerGenerator.linkerCommand({
                type: 'static-library',
                outputName: 'name',
                files: [ 'file.c' ]
            });

            linkerCommand.should.match(/^\$\(AR\) /);
            linkerCommand.should.containEql('/OUT:name.lib');
        });

        it('should link a dynamic library if "type" === "dynamic-library" using $(CC)', function () {
            var linkerCommand = ClCompilerGenerator.linkerCommand({
                type: 'dynamic-library',
                outputName: 'name',
                files: [ 'file.c' ]
            });

            linkerCommand.should.match(/^\$\(CC\) /);
            linkerCommand.should.containEql('/LD /Fename.dll file.c');
        });

        it('should use /nologo when linking an application', function () {
            var linkerCommand = ClCompilerGenerator.linkerCommand({
                type: 'application',
                outputName: 'app',
                files: ['main.c']
            });

            linkerCommand.should.containEql('/nologo');
        });

        it('should use /nologo when linking a static library', function () {
            var linkerCommand = ClCompilerGenerator.linkerCommand({
                type: 'static-library',
                outputName: 'app',
                files: ['main.c']
            });

            linkerCommand.should.containEql('/nologo');
        });

        it('should use /nologo when linking a dynamic library', function () {
            var linkerCommand = ClCompilerGenerator.linkerCommand({
                type: 'dynamic-library',
                outputName: 'app',
                files: ['main.c']
            });

            linkerCommand.should.containEql('/nologo');
        });

        it('should create an executable in the current directory', function () {
            var linkerCommand = ClCompilerGenerator.linkerCommand({
                type: 'application',
                outputName: 'app',
                files: ['main.c']
            });
            linkerCommand.should.match(/\/Feapp/);
        });

        it('should generate object file names from input files', function () {
            var linkerCommand = ClCompilerGenerator.linkerCommand({
                type: 'application',
                outputName: 'app',
                files: ['file.c']
            });

            linkerCommand.should.containEql('file.c.obj');
        });

        it('should link several object files into one executable', function () {
            var linkerCommand = ClCompilerGenerator.linkerCommand({
                type: 'application',
                outputName: 'app',
                files: [
                    'filea.c',
                    'fileb.c'
                ]
            });

            linkerCommand.should.containEql('filea.c');
            linkerCommand.should.containEql('fileb.c');
        });

        it('should add any specified library paths in libraryPaths', function () {
            var linkerCommand = ClCompilerGenerator.linkerCommand({
                type: 'application',
                outputName: 'executable',
                files: [ 'file.c' ],
                libraryPaths: [
                    'path',
                    'other_path'
                ]
            });

            linkerCommand.should.match(/\/link \/LIBPATH:path \/LIBPATH:other_path/);
        });

        it('should link with any specified libraries in libraries', function () {
            var linkerCommand = ClCompilerGenerator.linkerCommand({
                type: 'application',
                outputName: 'executable',
                files: [ 'file.c' ],
                libraries: [
                    'mylibrary',
                    'anotherlibrary'
                ]
            });

            linkerCommand.should.containEql('mylibrary.lib');
            linkerCommand.should.containEql('anotherlibrary.lib');
        });

        it('should convert object file paths to use backslashes instead of forward ones', function () {
            var linkerCommand = ClCompilerGenerator.linkerCommand({
                type: 'application',
                outputName: 'executable',
                files: [
                    'object/file/in/a/path.c'
                ]
            });

            linkerCommand.should.match(/object\\file\\in\\a\\path\.c/);
        });

        it('should include extra linker flags', function () {
            var linkerCommand = ClCompilerGenerator.linkerCommand({
                type: 'application',
                outputName: 'name',
                files: [ 'file.c' ],
                flags: '-flags'
            });

            linkerCommand.should.match(/\/link \-flags$/);
        });

        it('should prepend outputPath to outputName if given', function () {
            var linkerCommand = ClCompilerGenerator.linkerCommand({
                type: 'application',
                outputName: 'name',
                outputPath: 'some/directory/',
                files: [ 'file.c' ]
            });

            linkerCommand.should.containEql('some\\directory\\name');
        });
    });
});
