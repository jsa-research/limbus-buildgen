
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
var minimal = require('../source/minimal-configuration');

describe('makefile-generator', function () {
    it('should create an executable in the current directory', function () {
        var makefile = makefile_generator.generate(minimal.projectWithArtifactWith({
            host: 'linux'
        }));
        makefile.should.match(/\-o app/);
    });

    it('should accept files with dots in their paths', function () {
        var makefile = makefile_generator.generate(minimal.projectWithArtifactWith({
            files: ['file.with.dots.c']
        }));
        makefile.should.not.match(/[^\.]dots\.c/);
    });

    it('should generate a makefile with all artifacts built', function () {
        var makefile = makefile_generator.generate(minimal.projectWith({
            artifacts: [
                minimal.artifactWith({
                    outputName: 'first'
                }),
                minimal.artifactWith({
                    outputName: 'second'
                })
            ]
        }));
        makefile.should.match(/first/);
        makefile.should.match(/second/);
    });

    describe('artifact with multiple files', function () {
        it('should compile all of the files', function () {
            var makefile = makefile_generator.generate(minimal.projectWithArtifactWith({
                files: [
                    'file_a.c',
                    'file_b.c',
                    'file_c.c'
                ]
            }));

            makefile.should.match(/file_a\.c/);
            makefile.should.match(/file_b\.c/);
            makefile.should.match(/file_c\.c/);
        });
    });

    describe('makefile configured with a host', function () {
        it('should compile with the correct compiler for the specified host', function () {
            var hostsByCompiler = {
                'gcc': [
                    'darwin-gcc',
                    'linux',
                    'linux-gcc',
                    'freebsd-gcc'
                ],
                'clang': [
                    'darwin',
                    'darwin-clang',
                    'linux-clang',
                    'freebsd',
                    'freebsd-clang'
                ],
                'cl': [
                    'win32',
                    'win32-cl'
                ]
            };

            for (var compiler in hostsByCompiler) {
                var hosts = hostsByCompiler[compiler];
                hosts.forEach(function (host) {
                    var makefile = makefile_generator.generate(minimal.projectWithArtifactWith({
                        host: host
                    }));
                    makefile.should.containEql(compiler);
                });
            }
        });
    });

    describe('makefile where OS is freebsd', function () {
        it('should compile with libm by default', function () {
            var makefile = makefile_generator.generate(minimal.projectWithArtifactWith({
                host: 'freebsd-gcc'
            }));

            makefile.should.containEql('-lm');
        });

        it('should link with -Wl,-rpath=. using LLVM Clang or GNU GCC', function () {
            var makefile = makefile_generator.generate(minimal.projectWithArtifactWith({
                host: 'freebsd-clang'
            }));

            makefile.should.containEql('-Wl,-rpath=.');

            makefile = makefile_generator.generate(minimal.projectWithArtifactWith({
                host: 'freebsd-gcc'
            }));

            makefile.should.containEql('-Wl,-rpath=.');
        });

        it('should only link with -Wl,-rpath=. when type is "application"', function () {
            var makefile = makefile_generator.generate(minimal.projectWithArtifactWith({
                type: 'static-library',
                host: 'freebsd-clang'
            }));
            makefile.should.not.containEql('-Wl,-rpath=.');

            makefile = makefile_generator.generate(minimal.projectWithArtifactWith({
                type: 'dynamic-library',
                host: 'freebsd-gcc'
            }));

            makefile.should.not.containEql('-Wl,-rpath=.');
        });
    });

    describe('makefile where OS is linux', function () {
        it('should compile with libm by default', function () {
            var makefile = makefile_generator.generate(minimal.projectWithArtifactWith({
                host: 'linux-clang',
                files: ['test.c']
            }));

            makefile.should.containEql('-lm');
        });

        it('should link with -Wl,-rpath=. using LLVM Clang or GNU GCC', function () {
            var makefile = makefile_generator.generate(minimal.projectWithArtifactWith({
                host: 'linux-clang',
                files: [ 'test.c' ]
            }));

            makefile.should.containEql('-Wl,-rpath=.');

            makefile = makefile_generator.generate(minimal.projectWithArtifactWith({
                host: 'linux-gcc',
                files: [ 'test.c' ]
            }));

            makefile.should.containEql('-Wl,-rpath=.');
        });

        it('should only link with -Wl,-rpath=. when type is "application"', function () {
            var makefile = makefile_generator.generate(minimal.projectWithArtifactWith({
                type: 'static-library',
                host: 'linux-clang'
            }));
            makefile.should.not.containEql('-Wl,-rpath=.');

            makefile = makefile_generator.generate(minimal.projectWithArtifactWith({
                type: 'dynamic-library',
                host: 'linux-gcc'
            }));

            makefile.should.not.containEql('-Wl,-rpath=.');
        });
    });
});
