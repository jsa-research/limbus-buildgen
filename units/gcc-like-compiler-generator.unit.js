
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

var injectSpecs = function (compiler) {
    var GccCompilerGenerator = require('../source/' + compiler + '-compiler-generator');

    describe(compiler + '-compiler-generator', function () {
        describe('Compiling', function () {
            it('should compile a file into an object file with the same name', function () {
                var compilerCommand = GccCompilerGenerator.compilerCommand({
                    type: 'application',
                    file: 'test.c'
                });

                compilerCommand.should.match(new RegExp('^' + compiler + ' \\-c '));
                compilerCommand.should.containEql('test.c');
                compilerCommand.should.containEql('-o test.c.o');

                compilerCommand = GccCompilerGenerator.compilerCommand({
                    type: 'application',
                    file: 'other.c'
                });

                compilerCommand.should.containEql('other.c');
                compilerCommand.should.containEql('-o other.c.o');
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
                    flags: '--flag'
                });

                compilerCommand.should.containEql('--flag');
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
                    type: 'static-library',
                    objectFiles: [
                        'test.c.o'
                    ],
                    outputName: 'name',
                });

                linkerCommand.should.containEql('ar rcs libname.a');
            });

            it('should link as a dynamic library if "type" === "dynamic-library"', function () {
                var linkerCommand = GccCompilerGenerator.linkerCommand({
                    type: 'dynamic-library',
                    objectFiles: [
                        'test.c.o'
                    ],
                    outputName: 'name'
                });

                linkerCommand.should.containEql('-shared');
                linkerCommand.should.containEql('-o libname.so');
            });


            it('should include extra linker flags', function () {
                var linkerCommand = GccCompilerGenerator.linkerCommand({
                    type: 'application',
                    objectFiles: [
                        'file.obj'
                    ],
                    outputName: 'name',
                    flags: '--flag'
                });

                linkerCommand.should.containEql('--flag');
            });

            describe('outputPath', function () {
                it('should be prepended to outputName if given', function () {
                    var linkerCommand = GccCompilerGenerator.linkerCommand({
                        type: 'application',
                        objectFiles: [
                            'file.o'
                        ],
                        outputName: 'name',
                        outputPath: 'some/directory'
                    });

                    linkerCommand.should.containEql('some/directory/name');
                });

                it('should handle trailing slashes', function () {
                    var linkerCommand = GccCompilerGenerator.linkerCommand({
                        type: 'application',
                        objectFiles: [
                            'file.o'
                        ],
                        outputName: 'name',
                        outputPath: 'some/directory/'
                    });

                    linkerCommand.should.containEql('some/directory/name');
                });
            });
        });
    });
};

injectSpecs('gcc');
injectSpecs('clang');
