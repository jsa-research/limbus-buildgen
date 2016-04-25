
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
var makefile_generator = require('../source/makefile-generator');

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

        it('should link with -Wl,-rpath=. using LLVM Clang or GNU GCC', function () {
            var makefile = makefile_generator.generate({
                type: 'application',
                host: 'freebsd-clang',
                files: [ 'test.c' ],
                outputName: 'test'
            });

            makefile.should.containEql('-Wl,-rpath=.');

            makefile = makefile_generator.generate({
                type: 'application',
                host: 'freebsd-gcc',
                files: [ 'test.c' ],
                outputName: 'test'
            });

            makefile.should.containEql('-Wl,-rpath=.');
        });

        it('should only link with -Wl,-rpath=. when type is "application"', function () {
            var makefile = makefile_generator.generate({
                type: 'static-library',
                host: 'freebsd-clang',
                files: [ 'test.c' ],
                outputName: 'test'
            });
            makefile.should.not.containEql('-Wl,-rpath=.');

            makefile = makefile_generator.generate({
                type: 'dynamic-library',
                host: 'freebsd-gcc',
                files: [ 'test.c' ],
                outputName: 'test'
            });

            makefile.should.not.containEql('-Wl,-rpath=.');
        });
    });

    describe('makefile where OS is linux', function () {
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

        it('should link with -Wl,-rpath=. using LLVM Clang or GNU GCC', function () {
            var makefile = makefile_generator.generate({
                type: 'application',
                host: 'linux-clang',
                files: [ 'test.c' ],
                outputName: 'test'
            });

            makefile.should.containEql('-Wl,-rpath=.');

            makefile = makefile_generator.generate({
                type: 'application',
                host: 'linux-gcc',
                files: [ 'test.c' ],
                outputName: 'test'
            });

            makefile.should.containEql('-Wl,-rpath=.');
        });

        it('should only link with -Wl,-rpath=. when type is "application"', function () {
            var makefile = makefile_generator.generate({
                type: 'static-library',
                host: 'linux-clang',
                files: [ 'test.c' ],
                outputName: 'test'
            });
            makefile.should.not.containEql('-Wl,-rpath=.');

            makefile = makefile_generator.generate({
                type: 'dynamic-library',
                host: 'linux-gcc',
                files: [ 'test.c' ],
                outputName: 'test'
            });

            makefile.should.not.containEql('-Wl,-rpath=.');
        });
    });
});
