
// sea-strap.js - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

var should = require('should');
var makefile_generator = require('../source/makefile-generator');

var simpleMakefile = function(compiler, files, outputFile, extraFlags) {
    if (extraFlags) {
        extraFlags = " " + extraFlags;
    } else {
        extraFlags = "";
    }
    return "all:\n"
         + "\t" + compiler + " " + files + extraFlags + " -o " + outputFile + "\n";
};

describe('makefile-generator', function () {
    it('should create an executable in the current directory by default', function () {
        var makefile = makefile_generator.generate({
            files: [
                'source/files/test.c'
            ]
        });

        makefile.should.equal(simpleMakefile('gcc', 'source/files/test.c', 'test'));

        makefile = makefile_generator.generate({
            files: [
                'source/files/test.c'
            ],
            outputName: 'executable'
        });

        makefile.should.equal(simpleMakefile('gcc', 'source/files/test.c', 'executable'));
    });

    describe('makefile configured without any files', function () {
        var no_source_files_error = "no_source_files";
        
        it('should throw "no_source_files" when files is undefined', function () {
            (function () {
                makefile_generator.generate({});
            }).should.throw(no_source_files_error);
        });
        it('should throw "no_source_files" when files is empty', function () {
            (function () {
                makefile_generator.generate({
                    files: []
                });
            }).should.throw(no_source_files_error);
        });
    });

    describe('makefile configured with multiple files', function () {
        it('should compile all of the files into one executable', function () {
            var makefile = makefile_generator.generate({
                files: [
                    'file_a.c',
                    'file_b.c',
                    'file_c.c'
                ]
            });

            makefile.should.equal(simpleMakefile('gcc', 'file_a.c file_b.c file_c.c', 'file_a'));
        });
    });

    describe('makefile configured with outputName', function () {
        it('should create an executable with the specified name', function () {
            var makefile = makefile_generator.generate({
                files: [
                    'test.c'
                ],
                outputName: 'executable'
            });

            makefile.should.equal(simpleMakefile('gcc', 'test.c', 'executable'));
        });
    });

    describe('makefile configured without an outputName', function () {
        it('should name the resulting executable using the first given file without the extension by default', function () {
            var makefile = makefile_generator.generate({
                files: [
                    'another_executable.c'
                ]
            });

            makefile.should.equal(simpleMakefile('gcc', 'another_executable.c', 'another_executable'));

            makefile = makefile_generator.generate({
                files: [
                    'file.with.many.dots.c'
                ]
            });

            makefile.should.equal(simpleMakefile('gcc', 'file.with.many.dots.c', 'file.with.many.dots'));
        });

        it('should throw "given_source_file_without_extension" if the first source file is missing an extension', function () {
            (function () {
                makefile_generator.generate({
                    files: [
                        'source_without_extension'
                    ]
                });
            }).should.throw('given_source_file_without_extension');
        });
    });

    describe('makefile configured with a compiler', function () {
        it('should compile with the specified compiler', function () {
            var makefile = makefile_generator.generate({
                files: [
                    'test.c'
                ],
                compiler: 'gcc'
            });

            makefile.should.equal(simpleMakefile('gcc', 'test.c', 'test'));

            makefile = makefile_generator.generate({
                files: [
                    'test.c'
                ],
                compiler: 'clang'
            });

            makefile.should.equal(simpleMakefile('clang', 'test.c', 'test'));
        });
        it('should throw "invalid_compiler" if compiler is not gcc or clang', function () {
            (function () {
                makefile_generator.generate({
                    compiler: 'made up compiler'
                });
            }).should.throw('invalid_compiler');
        });
    });

    describe('makefile configured without a compiler', function () {
        it('should compile with gcc by default', function () {
            var makefile = makefile_generator.generate({
                files: [
                    'test.c'
                ]
            });

            makefile.should.equal(simpleMakefile('gcc', 'test.c', 'test'));
        });
    });

    describe('makefile configured with include path', function () {
        it('should add the correct flags', function () {
            var makefile = makefile_generator.generate({
                files: [
                    'test.c'
                ],
                includePaths: [
                    'includes/'
                ]
            });

            makefile.should.equal(simpleMakefile('gcc', 'test.c', 'test', '-Iincludes/'));
        });
    });
});
