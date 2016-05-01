
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

var GccCompilerGenerator = require('../source/gcc-like-compiler-generator');

describe('gcc-like-compiler-generator', function () {
    describe('Variables', function () {
        it('should return a dictionary with CC set to compiler', function () {
            var variables = GccCompilerGenerator.variables({
                compiler: 'gcc-like'
            });
            variables.CC.should.equal('gcc-like');
        });

        it('should return a dictionary with AR set to "ar"', function () {
            var variables = GccCompilerGenerator.variables({});
            variables.AR.should.equal('ar');
        });
    });

    describe('Compiling', function () {
        it('should accept files with dots in their paths', function () {
            var compilerCommand = GccCompilerGenerator.compilerCommand({
                file: 'file.with.dots.c'
            });
            compilerCommand.should.match(/file\.with\.dots\.c/);
        });

        it('should compile using compiler given by $(CC)', function () {
            var compilerCommand = GccCompilerGenerator.compilerCommand({
                type: 'application',
                file: 'test.c'
            });

            compilerCommand.should.match(/^\$\(CC\) /);
        });

        it('should compile a file into an object file with the filename and a .o postfix', function () {
            var compilerCommand = GccCompilerGenerator.compilerCommand({
                type: 'application',
                file: 'test.c'
            });

            compilerCommand.should.containEql('-o test.c.o');
        });

        it('should add any specified include paths in includePaths', function () {
            var compilerCommand = GccCompilerGenerator.compilerCommand({
                type: 'application',
                file: 'test.c',
                includePaths: [
                    'include_path',
                    'other_include'
                ]
            });

            compilerCommand.should.containEql('-Iinclude_path');
            compilerCommand.should.containEql('-Iother_include');
        });

        it('should compile as a dynamic library if "type" === "dynamic-library"', function () {
            var compilerCommand = GccCompilerGenerator.compilerCommand({
                type: 'dynamic-library',
                file: 'test.c'
            });

            compilerCommand.should.containEql('-fpic');
        });

        it('should include extra compiler flags', function () {
            var compilerCommand = GccCompilerGenerator.compilerCommand({
                type: 'application',
                file: 'file.c',
                flags: '-flags'
            });

            compilerCommand.should.containEql(' -flags');
        });

        it('should take a path as file', function () {
            var compilerCommand = GccCompilerGenerator.compilerCommand({
                type: 'application',
                file: './some/path/to/file.c'
            });

            compilerCommand.should.match(/\.\/some\/path\/to\/file\.c/);
        });
    });

    describe('Linking', function () {
        it('should link an application using $(CC)', function () {
            var linkerCommand = GccCompilerGenerator.linkerCommand({
                type: 'application',
                outputName: 'name',
                files: [ 'test.c' ]
            });

            linkerCommand.should.match(/^\$\(CC\) /);
        });

        it('should create an executable in the current directory', function () {
            var linkerCommand = GccCompilerGenerator.linkerCommand({
                type: 'application',
                outputName: 'app',
                files: ['main.c']
            });
            linkerCommand.should.match(/\-o app/);
        });

        it('should generate object file names from input files', function () {
            var linkerCommand = GccCompilerGenerator.linkerCommand({
                type: 'application',
                outputName: 'name',
                files: [
                    'test.c',
                    'second.c'
                ]
            });

            linkerCommand.should.containEql('test.c.o');
            linkerCommand.should.containEql('second.c.o');
        });

        it('should link several object files into one executable', function () {
            var linkerCommand = GccCompilerGenerator.linkerCommand({
                type: 'application',
                outputName: 'name',
                files: [
                    'test.c',
                    'second.c'
                ]
            });

            linkerCommand.should.containEql('test.c');
            linkerCommand.should.containEql('second.c');
        });

        it('should add any specified library paths in libraryPaths', function () {
            var linkerCommand = GccCompilerGenerator.linkerCommand({
                type: 'application',
                outputName: 'name',
                files: [ 'test.c' ],
                libraryPaths: [
                    'path',
                    'other_path'
                ]
            });

            linkerCommand.should.containEql('-Lpath');
            linkerCommand.should.containEql('-Lother_path');
        });

        it('should link with any specified libraries in libraries', function () {
            var linkerCommand = GccCompilerGenerator.linkerCommand({
                type: 'application',
                outputName: 'name',
                files: [ 'test.c' ],
                libraries: [
                    'mylibrary',
                    'anotherlibrary'
                ]
            });

            linkerCommand.should.containEql('-L./ -lmylibrary');
            linkerCommand.should.containEql('-L./ -lanotherlibrary');
        });

        it('should link as a static library if "type" === "static-library" using $(AR)', function () {
            var linkerCommand = GccCompilerGenerator.linkerCommand({
                type: 'static-library',
                outputName: 'name',
                files: [ 'test.c' ]
            });

            linkerCommand.should.containEql('$(AR) rcs libname.a');
        });

        it('should link as a dynamic library if "type" === "dynamic-library" using $(CC)', function () {
            var linkerCommand = GccCompilerGenerator.linkerCommand({
                type: 'dynamic-library',
                outputName: 'name',
                files: [ 'test.c' ]
            });

            linkerCommand.should.match(/^\$\(CC\) /);
            linkerCommand.should.containEql('-shared');
            linkerCommand.should.containEql('-o libname.so');
        });

        it('should include extra linker flags', function () {
            var linkerCommand = GccCompilerGenerator.linkerCommand({
                type: 'application',
                outputName: 'name',
                files: [ 'test.c' ],
                flags: '-flags'
            });

            linkerCommand.should.containEql(' -flags');
        });

        it('should prepend outputPath to outputName if given', function () {
            var linkerCommand = GccCompilerGenerator.linkerCommand({
                type: 'application',
                outputName: 'name',
                outputPath: 'some/directory/',
                files: [ 'test.c' ]
            });

            linkerCommand.should.containEql('some/directory/name');
        });
    });
});
