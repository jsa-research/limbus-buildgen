
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
var CompilerGenerator = require('../units/compiler-generator');

var injectSpecs = function (compiler) {
    var GccCompilerGenerator = require('../source/' + compiler + '-compiler-generator');
    
    describe(compiler + '-compiler-generator', function () {
        describe('Compiling', function () {
            it('should compile a file into an object file with the same name', function () {
                var compilerCommand = GccCompilerGenerator.compilerCommand({
                    file: 'test.c'
                });

                compilerCommand.should.match(new RegExp('^' + compiler + ' \\-c '));
                compilerCommand.should.containEql('test.c');
                compilerCommand.should.containEql('-o test.c.o');

                compilerCommand = GccCompilerGenerator.compilerCommand({
                    file: 'other.c'
                });

                compilerCommand.should.containEql('other.c');
                compilerCommand.should.containEql('-o other.c.o');
            });

            it('should add any specified include paths in includePaths', function () {
                var compilerCommand = GccCompilerGenerator.compilerCommand({
                    file: 'test.c',
                    includePaths: [
                        'include_path',
                        'other_include'
                    ]
                });

                compilerCommand.should.containEql('-Iinclude_path');
                compilerCommand.should.containEql('-Iother_include');
            });

            CompilerGenerator.injectCompilerInterfaceSpecs(GccCompilerGenerator.compilerCommand);
        });

        describe('Linking', function () {
            it('should link several object files into one executable with outputName', function () {
                var linkerCommand = GccCompilerGenerator.linkerCommand({
                    objectFiles: [
                        'test.c.o',
                        'second.c.o'
                    ],
                    outputName: 'name',
                    type: 'application'
                });

                linkerCommand.should.match(new RegExp('^' + compiler + ' '));
                linkerCommand.should.containEql('test.c.o');
                linkerCommand.should.containEql('second.c.o');
                linkerCommand.should.containEql('-o name');
            });

            it('should link with any specified libraries in libraries', function () {
                var linkerCommand = GccCompilerGenerator.linkerCommand({
                    objectFiles: [
                        'test.c.o'
                    ],
                    outputName: 'name',
                    type: 'application',
                    libraries: [
                        'mylibrary',
                        'anotherlibrary'
                    ]
                });

                linkerCommand.should.containEql('-L./ -lmylibrary');
                linkerCommand.should.containEql('-L./ -lanotherlibrary');
            });

            it('should link as a static library if "type" === "static-library"', function () {
                var linkerCommand = GccCompilerGenerator.linkerCommand({
                    objectFiles: [
                        'test.c.o'
                    ],
                    outputName: 'name',
                    type: 'static-library'
                });

                linkerCommand.should.containEql('ar rcs libname.a');
            });

            CompilerGenerator.injectLinkerInterfaceSpecs(GccCompilerGenerator.linkerCommand);
        });
    });
};

injectSpecs('gcc');
injectSpecs('clang');
