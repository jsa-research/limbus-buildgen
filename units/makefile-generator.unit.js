
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
var makefile_generator = require('../source/makefile-generator');

describe('makefile-generator', function () {
    it('should have a list with the supported hosts', function () {
        makefile_generator.supportedHosts.length.should.equal(8);
        makefile_generator.supportedHosts.should.containEql('darwin');
        makefile_generator.supportedHosts.should.containEql('darwin-clang');
        makefile_generator.supportedHosts.should.containEql('linux');
        makefile_generator.supportedHosts.should.containEql('linux-gcc');
        makefile_generator.supportedHosts.should.containEql('linux-clang');
        makefile_generator.supportedHosts.should.containEql('freebsd');
        makefile_generator.supportedHosts.should.containEql('win32');
        makefile_generator.supportedHosts.should.containEql('win32-cl');
    });

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

    it('should throw "unknown_config_property" if the provided config object has an unknown property and provide the name as unknownProperty', function () {
        try {
            makefile_generator.generate({
                files: [
                    'simple.c'
                ],
                someUnknownProperty: 'this should throw an error'
            });
        } catch (e) {
            e.message.should.equal('unknown_config_property');
            e.unknownProperty.should.equal('someUnknownProperty');
            return;
        }
        
        throw new Error('Expected error');
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

            makefile = makefile_generator.generate({
                files: [
                    'test.c'
                ],
                host: 'win32-cl'
            });
            makefile.should.match(/\tcl /);
        });

        it('should throw "invalid_host" if host is not one of the predefined hosts', function () {
            [
                'made up host',
                'darwin-gcc',
                'darw',
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
            makefile_generator.supportedHosts.forEach(function (host) {
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

    describe('makefile configured with extra compiler flags', function () {
        it('should add the flag string as is, no matter which compiler is used', function () {
            var makefile = makefile_generator.generate({
                files: [
                    'test.c'
                ],
                compilerFlags: '-some-super-cool-flag',
                host: 'linux'
            });

            makefile.should.match(/ -some-super-cool-flag /);

            makefile = makefile_generator.generate({
                files: [
                    'test.c'
                ],
                compilerFlags: '-some-super-cool-flag',
                host: 'win32'
            });

            makefile.should.match(/ -some-super-cool-flag /);
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

    describe('makefile where host is linux', function () {
        it('should compile with libm by default', function () {
            var makefile = makefile_generator.generate({
                files: [
                    'test.c'
                ],
                host: 'linux'
            });

            makefile.should.match(/ -lm /);
        });
    });

    describe('makefile where host is win32-cl', function () {
        it('should use the correct flags', function () {
            var makefile = makefile_generator.generate({
                files: [
                    'test.c'
                ],
                host: 'win32-cl'
            });

            makefile.should.match(/ \/Fetest/);

            var makefile = makefile_generator.generate({
                files: [
                    'test.c'
                ],
                includePaths: [
                    'includes'
                ],
                host: 'win32-cl'
            });

            makefile.should.match(/ \/Iincludes /);
        });

        it('should convert paths to use backslashes instead of forward ones', function () {
            var makefile = makefile_generator.generate({
                files: [
                    'in/some/path/test.c'
                ],
                host: 'win32-cl'
            });

            makefile.should.match(/in\\some\\path\\test.c/);

            var makefile = makefile_generator.generate({
                files: [
                    'test.c'
                ],
                includePaths: [
                    'include/some/directory/'
                ],
                host: 'win32-cl'
            });

            makefile.should.match(/include\\some\\directory\\/);
        });
    });
});
