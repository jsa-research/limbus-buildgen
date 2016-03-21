
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
var util = require('../units/util');

var hostsByCompiler = {
    clang: [
        'linux-clang',
        'darwin',
        'darwin-clang',
        'freebsd',
        'freebsd-clang'
    ],
    gcc: [
        'linux',
        'linux-gcc',
        'darwin-gcc',
        'freebsd-gcc'
    ],
    cl: [
        'win32',
        'win32-cl'
    ]
};

describe('makefile-generator', function () {
    it('should have a list with the supported hosts', function () {
        var hostCount = 0;
        for (var compiler in hostsByCompiler) {
            var hosts = hostsByCompiler[compiler];
            hosts.forEach(function (host) {
                makefile_generator.supportedHosts.should.containEql(host);
                hostCount += 1;
            });
        }
        makefile_generator.supportedHosts.length.should.equal(hostCount);
    });

    it('should create an executable in the current directory', function () {
        var makefile = makefile_generator.generate({
            type: 'application',
            host: 'linux',
            files: [
                'source/files/test.c'
            ],
            outputName: 'test'
        });

        makefile.should.match(/\-o test/);

        makefile = makefile_generator.generate({
            type: 'application',
            host: 'linux',
            files: [
                'source/files/test.c'
            ],
            outputName: 'executable'
        });

        makefile.should.match(/\-o executable/);
    });

    it('should accept files with dots in their paths', function () {
        var makefile = makefile_generator.generate({
            type: 'application',
            host: 'linux',
            files: [
                'file.with.dots.c'
            ],
            outputName: 'test'
        });

        makefile.should.not.match(/[^\.]dots\.c/);
    });

    describe('makefile configured with multiple files', function () {
        it('should compile all of the files', function () {
            var makefile = makefile_generator.generate({
                type: 'application',
                host: 'linux',
                files: [
                    'file_a.c',
                    'file_b.c',
                    'file_c.c'
                ],
                outputName: 'test'
            });

            makefile.should.match(/file_a\.c/);
            makefile.should.match(/file_b\.c/);
            makefile.should.match(/file_c\.c/);
        });
    });

    describe('makefile configured with a host', function () {
        it('should compile with the correct compiler for the specified host', function () {
            for (var compiler in hostsByCompiler) {
                var hosts = hostsByCompiler[compiler];
                hosts.forEach(function (host) {
                    var makefile = makefile_generator.generate({
                        type: 'application',
                        host: host,
                        files: [
                            'test.c'
                        ],
                        outputName: 'test'
                    });
                    makefile.should.containEql(compiler);
                });
            }
        });
    });

    describe('makefile where OS is freebsd', function () {
        it('should compile with libm by default', function () {
            var makefile = makefile_generator.generate({
                type: 'application',
                host: 'freebsd-gcc',
                files: [
                    'test.c'
                ],
                outputName: 'test'
            });

            makefile.should.containEql('-lm');
        });
    });

    describe('makefile where os is linux', function () {
        it('should compile with libm by default', function () {
            var makefile = makefile_generator.generate({
                type: 'application',
                host: 'linux-clang',
                files: [
                    'test.c'
                ],
                outputName: 'test'
            });

            makefile.should.containEql('-lm');
        });
    });

    describe('Error Handling', function () {
        describe('type', function () {
            it('should throw "no_type" if no type is given', function () {
                (function () {
                    makefile_generator.generate({
                        host: 'linux',
                        files: [
                            'test.c'
                        ],
                        outputName: 'test'
                    });
                }).should.throw('no_type');
            });

            it('should throw "type_is_not_a_string" if type is anything other than a string', function () {
                util.should_throw_not_string_error(makefile_generator.generate, {
                    host: 'linux',
                    files: [
                        'test.c'
                    ],
                    outputName: 'test'
                }, 'type');
            });
        });

        describe('host', function () {
            it('should throw "no_host" if no host is given', function () {
                (function () {
                    makefile_generator.generate({
                        type: 'application',
                        files: [
                            'test.c'
                        ],
                        outputName: 'test'
                    });
                }).should.throw('no_host');
            });

            it('should throw "host_is_not_a_string" if host is anything other than a string', function () {
                util.should_throw_not_string_error(makefile_generator.generate, {
                    type: 'application',
                    files: [
                        'test.c'
                    ],
                    outputName: 'test'
                }, 'host');
            });

            it('should not throw "invalid_host" if host is one of the predefined hosts', function () {
                makefile_generator.supportedHosts.forEach(function (host) {
                    (function () {
                        makefile_generator.generate({
                            type: 'application',
                            host: host,
                            files: [
                                'file.c'
                            ],
                            outputName: 'test'
                        });
                    }).should.not.throw('invalid_host');
                });
            });

            it('should throw "invalid_host" if host is not one of the predefined hosts', function () {
                [
                    'made up host',
                    'darwin-cl',
                    'darw',
                    'osx'

                ].forEach(function (host) {
                    (function () {
                        makefile_generator.generate({
                            type: 'application',
                            host: host,
                            files: [
                                'file.c'
                            ],
                            outputName: 'test'
                        });
                    }).should.throw('invalid_host');
                });
            });
        });

        describe('files', function () {
            var no_files_error = 'no_files';
            it('should throw "no_files" when files is undefined', function () {
                (function () {
                    makefile_generator.generate({
                        type: 'application',
                        host: 'linux',
                        outputName: 'test'
                    });
                }).should.throw(no_files_error);
            });

            it('should throw "no_files" when files is empty', function () {
                (function () {
                    makefile_generator.generate({
                        type: 'application',
                        host: 'linux',
                        files: [],
                        outputName: 'test'
                    });
                }).should.throw(no_files_error);
            });

            it('should throw "files_is_not_a_string_array" if files is anything other than an array of strings', function () {
    util.should_throw_not_string_array_error(makefile_generator.generate, {
                    type: 'application',
                    host: 'linux',
                    outputName: 'test'
                }, 'files');
            });

            it('should throw "file_has_no_extension" if files has a filename without an extension', function () {
                (function () {
                    makefile_generator.generate({
                        type: 'application',
                        host: 'linux',
                        files: ['no_extension'],
                        outputName: 'test'
                    });
                }).should.throw('file_has_no_extension');

                (function () {
                    makefile_generator.generate({
                        type: 'application',
                        host: 'linux',
                        files: ['/path.with.dot/no_extension'],
                        outputName: 'test'
                    });
                }).should.throw('file_has_no_extension');
            });
        });

        describe('outputName', function () {
            it('should throw "no_output_name" when outputName is undefined', function () {
                (function () {
                    makefile_generator.generate({
                        type: 'application',
                        host: 'linux',
                        files: [
                            'file.c'
                        ]
                    });
                }).should.throw("no_output_name");
            });

            it('should throw "output_name_is_not_a_string" if outputName is anything other than a string', function () {
    util.should_throw_not_string_error(makefile_generator.generate, {
                    type: 'application',
                    host: 'linux',
                    files: [
                        'file.c'
                    ]
                }, 'outputName');
            });

            it('should throw "output_name_does_not_take_a_path" if outputName is given a path', function () {
                (function () {
                    makefile_generator.generate({
                        type: 'application',
                        host: 'linux',
                        files: [
                            'file.c'
                        ],
                        outputName: 'a/path/in/name'
                    });
                }).should.throw("output_name_does_not_take_a_path");
            });
        });

        describe('outputPath', function () {
            it('should throw "output_path_is_not_a_string" if outputPath is anything other than a string', function () {
                util.should_throw_not_string_error(makefile_generator.generate, {
                    type: 'application',
                    host: 'linux',
                    files: [
                        'file.c'
                    ],
                    outputName: 'name'
                }, 'outputPath');
            });
        });

        describe('compilerFlags', function () {
            it('should throw "compiler_flags_is_not_a_string" if compilerFlags is anything other than a string', function () {
    util.should_throw_not_string_error(makefile_generator.generate, {
                    type: 'application',
                    host: 'linux',
                    files: [
                        'file.c'
                    ],
                    outputName: 'name'
                }, 'compilerFlags');
            });
        });

        describe('linkerFlags', function () {
            it('should throw "linker_flags_is_not_a_string" if linkerFlags is anything other than a string', function () {
    util.should_throw_not_string_error(makefile_generator.generate, {
                    type: 'application',
                    host: 'linux',
                    files: [
                        'file.c'
                    ],
                    outputName: 'name'
                }, 'linkerFlags');
            });
        });

        describe('includePaths', function () {
            it('should throw "include_paths_is_not_a_string_array" if includePaths is anything other than an array of strings', function () {
    util.should_throw_not_string_array_error(makefile_generator.generate, {
                    type: 'application',
                    host: 'linux',
                    files: [
                        'file.c'
                    ],
                    outputName: 'test'
                }, 'includePaths');
            });
        });

        describe('libraries', function () {
            it('should throw "libraries_is_not_a_string_array" if libraries is anything other than an array of strings', function () {
    util.should_throw_not_string_array_error(makefile_generator.generate, {
                    type: 'application',
                    host: 'linux',
                    files: [
                        'file.c'
                    ],
                    outputName: 'test'
                }, 'libraries');
            });
        });

        it('should throw "unknown_config_property" if the provided config object has an unknown property and provide the name as unknownProperty', function () {
            try {
                makefile_generator.generate({
                    type: 'application',
                    host: 'linux',
                    files: [
                        'simple.c'
                    ],
                    someUnknownProperty: 'this should throw an error',
                    outputName: 'test'
                });
            } catch (e) {
                e.message.should.equal('unknown_config_property');
                e.unknownProperty.should.equal('someUnknownProperty');
                return;
            }

            throw new Error('Expected error');
        });
    });
});
