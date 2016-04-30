
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
var ConfigHostDecorator = require('../source/config-host-decorator');
var minimal = require('../source/minimal-configuration');

var shouldDecorateLinkerFlags = function (flags, properties) {
    var configuration = minimal.projectWithArtifactWith(properties);
    ConfigHostDecorator.decorate(configuration);
    configuration.artifacts[0].linkerFlags.should.containEql(flags);
};

var shouldNotDecorateLinkerFlags = function (flags, properties) {
    var configuration = minimal.projectWithArtifactWith(properties);
    ConfigHostDecorator.decorate(configuration);
    if (configuration.artifacts[0].linkerFlags !== undefined) {
        configuration.artifacts[0].linkerFlags.should.not.containEql(flags);
    }
};

var shouldNotDecorateAnything = function (properties) {
    var configuration = minimal.projectWithArtifactWith(properties);
    ConfigHostDecorator.decorate(configuration);
    configuration.should.deepEqual(minimal.projectWithArtifactWith(properties));
};

describe('config-host-decorator', function () {
    it('should decorate all artifacts', function () {
        var configuration = minimal.projectWith({
            artifacts: [
                minimal.artifactWith({
                    host: 'linux'
                }),
                minimal.artifactWith({
                    host: 'linux'
                })
            ]
        });
        ConfigHostDecorator.decorate(configuration);
        configuration.artifacts[1].linkerFlags.should.containEql('-lm');
    });

    it('should keep any existing linkerFlags', function () {
        var configuration = minimal.projectWithArtifactWith({
            host: 'linux',
            linkerFlags: '-linkflag'
        });
        ConfigHostDecorator.decorate(configuration);
        configuration.artifacts[0].linkerFlags.should.containEql('-linkflag');
    });

    describe('configuration where host OS is win32', function () {
        it('should not decorate', function () {
            shouldNotDecorateAnything({
                host: 'win32'
            });
            shouldNotDecorateAnything({
                host: 'win32-cl'
            });
        });
    });

    describe('configuration where host OS is darwin', function () {
        it('should not decorate', function () {
            shouldNotDecorateAnything({
                host: 'darwin'
            });
            shouldNotDecorateAnything({
                host: 'darwin-gcc'
            });
            shouldNotDecorateAnything({
                host: 'darwin-clang'
            });
        });
    });

    describe('configuration where host OS is freebsd', function () {
        it('should link with libm by default', function () {
            shouldDecorateLinkerFlags('-lm', {
                host: 'freebsd-clang'
            });

            shouldDecorateLinkerFlags('-lm', {
                host: 'freebsd-gcc'
            });
        });

        it('should link with -Wl,-rpath=. using LLVM Clang or GNU GCC', function () {
            shouldDecorateLinkerFlags('-Wl,-rpath=.', {
                host: 'freebsd-clang'
            });

            shouldDecorateLinkerFlags('-Wl,-rpath=.', {
                host: 'freebsd-gcc'
            });
        });

        it('should only link with -Wl,-rpath=. when type is "application"', function () {
            shouldNotDecorateLinkerFlags('-Wl,-rpath=.', {
                type: 'static-library',
                host: 'freebsd-clang'
            });

            shouldNotDecorateLinkerFlags('-Wl,-rpath=.', {
                type: 'static-library',
                host: 'freebsd-gcc'
            });

            shouldNotDecorateLinkerFlags('-Wl,-rpath=.', {
                type: 'dynamic-library',
                host: 'freebsd-clang'
            });

            shouldNotDecorateLinkerFlags('-Wl,-rpath=.', {
                type: 'dynamic-library',
                host: 'freebsd-gcc'
            });
        });
    });

    describe('configuration where host OS is linux', function () {
        it('should link with libm by default', function () {
            shouldDecorateLinkerFlags('-lm', {
                host: 'linux-clang'
            });

            shouldDecorateLinkerFlags('-lm', {
                host: 'linux-gcc'
            });
        });

        it('should link with -Wl,-rpath=. using LLVM Clang or GNU GCC', function () {
            shouldDecorateLinkerFlags('-Wl,-rpath=.', {
                host: 'linux-clang'
            });

            shouldDecorateLinkerFlags('-Wl,-rpath=.', {
                host: 'linux-gcc'
            });
        });

        it('should only link with -Wl,-rpath=. when type is "application"', function () {
            shouldNotDecorateLinkerFlags('-Wl,-rpath=.', {
                type: 'static-library',
                host: 'linux-clang'
            });

            shouldNotDecorateLinkerFlags('-Wl,-rpath=.', {
                type: 'static-library',
                host: 'linux-gcc'
            });

            shouldNotDecorateLinkerFlags('-Wl,-rpath=.', {
                type: 'dynamic-library',
                host: 'linux-clang'
            });

            shouldNotDecorateLinkerFlags('-Wl,-rpath=.', {
                type: 'dynamic-library',
                host: 'linux-gcc'
            });
        });
    });
});
