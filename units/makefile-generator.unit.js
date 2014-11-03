
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

describe('makefile-generator', function () {
    it('should create an executable in the current directory by default', function () {
        var makefile = makefile_generator.generate({
            files: [
                'source/files/test.c'
            ]
        });

        makefile.should.match(/-o test/);

        makefile = makefile_generator.generate({
            files: [
                'source/files/test.c'
            ],
            outputName: 'executable'
        });

        makefile.should.match(/-o executable/);
    });

    describe('makefile configured without any files', function () {
        var no_source_files_error = 'no_source_files';
        
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

            makefile.should.match(/file_a\.c file_b\.c file_c\.c/);
        });
    });

    describe('makefile configured with outputName', function () {
        it('should create an executable with the specified name', function () {
            var makefile = makefile_generator.generate({
                files: [
                    'test.c'
                ],
                outputName: 'executable.exe'
            });

            makefile.should.match(/-o executable\.exe\n/);
        });
    });

    describe('makefile configured without an outputName', function () {
        it('should name the resulting executable using the first given file without the extension by default', function () {
            var makefile = makefile_generator.generate({
                files: [
                    'another_executable.c',
                    'test.c'
                ]
            });

            makefile.should.match(/-o another_executable\n/);

            makefile = makefile_generator.generate({
                files: [
                    'file.with.many.dots.c'
                ]
            });

            makefile.should.match(/-o file.with.many.dots\n/);
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

    describe('makefile configured with a host', function () {
        it('should compile with the correct compiler for the specified host', function () {
            var makefile = makefile_generator.generate({
                files: [
                    'test.c'
                ],
                host: 'linux'
            });
            makefile.should.match(/\tgcc /);

            makefile = makefile_generator.generate({
                files: [
                    'test.c'
                ],
                host: 'darwin'
            });
            makefile.should.match(/\tclang /);

            makefile = makefile_generator.generate({
                files: [
                    'test.c'
                ],
                host: 'linux-clang'
            });
            makefile.should.match(/\tclang /);
        });
        it('should throw "invalid_host" if host is not one of the predefined hosts', function () {
            [
                'made up host',
                'darwin-gcc',
                'osx'

            ].forEach(function (host) {
                (function () {
                    makefile_generator.generate({
                        host: host
                    });
                }).should.throw('invalid_host');
            });
        });

        it('should not throw "invalid_host" if host is one of the predefined hosts', function () {
            [
                'darwin',
                'darwin-clang',
                'freebsd',
                'linux',
                'linux-gcc',
                'linux-clang'
            
            ].forEach(function (host) {
                (function () {
                    makefile_generator.generate({
                        host: host
                    });
                }).should.not.throw('invalid_host');
            });
        });
    });

    describe('makefile configured without a host', function () {
        it('should compile with gcc by default', function () {
            var makefile = makefile_generator.generate({
                files: [
                    'test.c'
                ]
            });

            makefile.should.match(/\tgcc /);
        });
    });

    describe('makefile configured with include path', function () {
        it('should add the correct flag', function () {
            var makefile = makefile_generator.generate({
                files: [
                    'test.c'
                ],
                includePaths: [
                    'includes/'
                ]
            });

            makefile.should.match(/ -Iincludes\/ /);
        });
    });

    describe('makefile where host is freebsd', function () {
        it('should compile with libm by default', function () {
            var makefile = makefile_generator.generate({
                files: [
                    'test.c'
                ],
                host: 'freebsd'
            });

            makefile.should.match(/ -lm /);
        });
    });
});
