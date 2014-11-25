
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

var hostsByCompiler = {
    clang: [
        'darwin',
        'darwin-clang',
        'linux-clang',
        'freebsd',
        'freebsd-clang'
    ],
    gcc: [
        'linux',
        'linux-gcc'
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

    it('should create an executable in the current directory by default', function () {
        var makefile = makefile_generator.generate({
            files: [
                'source/files/test.c'
            ],
            type: 'application',
            outputName: 'test'
        });

        makefile.should.match(/\-o test/);

        makefile = makefile_generator.generate({
            files: [
                'source/files/test.c'
            ],
            outputName: 'executable',
            type: 'application'
        });

        makefile.should.match(/\-o executable/);
    });

    it('should throw "unknown_config_property" if the provided config object has an unknown property and provide the name as unknownProperty', function () {
        try {
            makefile_generator.generate({
                files: [
                    'simple.c'
                ],
                someUnknownProperty: 'this should throw an error',
                type: 'application',
                outputName: 'test'
            });
        } catch (e) {
            e.message.should.equal('unknown_config_property');
            e.unknownProperty.should.equal('someUnknownProperty');
            return;
        }
        
        throw new Error('Expected error');
    });

    describe('makefile configured without any files', function () {
        var no_files_error = 'no_files';
        
        it('should throw "no_files" when files is undefined', function () {
            (function () {
                makefile_generator.generate({
                    type: 'application',
                    outputName: 'test'
                });
            }).should.throw(no_files_error);
        });
        it('should throw "no_files" when files is empty', function () {
            (function () {
                makefile_generator.generate({
                    files: [],
                    type: 'application',
                    outputName: 'test'
                });
            }).should.throw(no_files_error);
        });
    });

    describe('makefile configured with multiple files', function () {
        it('should compile all of the files', function () {
            var makefile = makefile_generator.generate({
                files: [
                    'file_a.c',
                    'file_b.c',
                    'file_c.c'
                ],
                type: 'application',
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
                        files: [
                            'test.c'
                        ],
                        host: host,
                        type: 'application',
                        outputName: 'test'
                    });
                    makefile.should.containEql(compiler);
                });
            }
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
                        host: host,
                        type: 'application',
                        outputName: 'test'
                    });
                }).should.throw('invalid_host');
            });
        });

        it('should not throw "invalid_host" if host is one of the predefined hosts', function () {
            makefile_generator.supportedHosts.forEach(function (host) {
                (function () {
                    makefile_generator.generate({
                        host: host,
                        type: 'application',
                        outputName: 'test'
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
                ],
                type: 'application',
                outputName: 'test'
            });

            makefile.should.match(/\tgcc /);
        });
    });

    describe('makefile where host is freebsd', function () {
        it('should compile with libm by default', function () {
            var makefile = makefile_generator.generate({
                files: [
                    'test.c'
                ],
                host: 'freebsd',
                type: 'application',
                outputName: 'test'
            });

            makefile.should.containEql('-lm');
        });
    });

    describe('makefile where host is linux', function () {
        it('should compile with libm by default', function () {
            var makefile = makefile_generator.generate({
                files: [
                    'test.c'
                ],
                host: 'linux',
                type: 'application',
                outputName: 'test'
            });

            makefile.should.containEql('-lm');
        });
    });
});
