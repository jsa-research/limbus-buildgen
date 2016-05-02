
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
                host: 'win32-make-cl-win32-x86'
            });
            shouldNotDecorateAnything({
                host: 'win32-make-cl-win32-x64'
            });
        });
    });

    describe('configuration where host OS is darwin', function () {
        it('should not decorate', function () {
            shouldNotDecorateAnything({
                host: 'darwin'
            });
            shouldNotDecorateAnything({
                host: 'darwin-make-clang-darwin-x86'
            });
            shouldNotDecorateAnything({
                host: 'darwin-make-clang-darwin-x64'
            });
            shouldNotDecorateAnything({
                host: 'darwin-make-gcc-darwin-x86'
            });
            shouldNotDecorateAnything({
                host: 'darwin-make-gcc-darwin-x64'
            });
        });
    });

    describe('configuration where host OS is freebsd', function () {
        it('should link with libm by default', function () {
            var flag = '-lm';

            shouldDecorateLinkerFlags(flag, {
                host: 'freebsd'
            });

            shouldDecorateLinkerFlags(flag, {
                host: 'freebsd-make-clang-freebsd-x86'
            });
            shouldDecorateLinkerFlags(flag, {
                host: 'freebsd-make-clang-freebsd-x64'
            });

            shouldDecorateLinkerFlags(flag, {
                host: 'freebsd-make-gcc-freebsd-x86'
            });
            shouldDecorateLinkerFlags(flag, {
                host: 'freebsd-make-gcc-freebsd-x64'
            });
        });

        it('should link with -Wl,-rpath=. using LLVM Clang or GNU GCC', function () {
            var flag = '-Wl,-rpath=.';

            shouldDecorateLinkerFlags(flag, {
                host: 'freebsd'
            });

            shouldDecorateLinkerFlags(flag, {
                host: 'freebsd-make-clang-freebsd-x86'
            });
            shouldDecorateLinkerFlags(flag, {
                host: 'freebsd-make-clang-freebsd-x64'
            });

            shouldDecorateLinkerFlags(flag, {
                host: 'freebsd-make-gcc-freebsd-x86'
            });
            shouldDecorateLinkerFlags(flag, {
                host: 'freebsd-make-gcc-freebsd-x64'
            });
        });

        it('should only link with -Wl,-rpath=. when type is "application"', function () {
            var flag = '-Wl,-rpath=.';

            shouldNotDecorateLinkerFlags(flag, {
                host: 'freebsd',
                type: 'static-library'
            });
            shouldNotDecorateLinkerFlags(flag, {
                host: 'freebsd-make-clang-freebsd-x86',
                type: 'static-library'
            });
            shouldNotDecorateLinkerFlags(flag, {
                host: 'freebsd-make-clang-freebsd-x64',
                type: 'static-library'
            });
            shouldNotDecorateLinkerFlags(flag, {
                host: 'freebsd-make-gcc-freebsd-x86',
                type: 'static-library'
            });
            shouldNotDecorateLinkerFlags(flag, {
                host: 'freebsd-make-gcc-freebsd-x64',
                type: 'static-library'
            });

            shouldNotDecorateLinkerFlags(flag, {
                host: 'freebsd',
                type: 'dynamic-library'
            });
            shouldNotDecorateLinkerFlags(flag, {
                host: 'freebsd-make-clang-freebsd-x86',
                type: 'dynamic-library'
            });
            shouldNotDecorateLinkerFlags(flag, {
                host: 'freebsd-make-clang-freebsd-x64',
                type: 'dynamic-library'
            });
            shouldNotDecorateLinkerFlags(flag, {
                host: 'freebsd-make-gcc-freebsd-x86',
                type: 'dynamic-library'
            });
            shouldNotDecorateLinkerFlags(flag, {
                host: 'freebsd-make-gcc-freebsd-x64',
                type: 'dynamic-library'
            });
        });
    });

    describe('configuration where host OS is linux', function () {
        it('should link with libm by default', function () {
            var flag = '-lm';

            shouldDecorateLinkerFlags(flag, {
                host: 'linux'
            });

            shouldDecorateLinkerFlags(flag, {
                host: 'linux-make-clang-linux-x86'
            });
            shouldDecorateLinkerFlags(flag, {
                host: 'linux-make-clang-linux-x64'
            });

            shouldDecorateLinkerFlags(flag, {
                host: 'linux-make-gcc-linux-x86'
            });
            shouldDecorateLinkerFlags(flag, {
                host: 'linux-make-gcc-linux-x64'
            });
        });

        it('should link with -Wl,-rpath=. using LLVM Clang or GNU GCC', function () {
            var flag = '-Wl,-rpath=.';

            shouldDecorateLinkerFlags(flag, {
                host: 'linux'
            });

            shouldDecorateLinkerFlags(flag, {
                host: 'linux-make-clang-linux-x86'
            });
            shouldDecorateLinkerFlags(flag, {
                host: 'linux-make-clang-linux-x64'
            });

            shouldDecorateLinkerFlags(flag, {
                host: 'linux-make-gcc-linux-x86'
            });
            shouldDecorateLinkerFlags(flag, {
                host: 'linux-make-gcc-linux-x64'
            });
        });

        it('should only link with -Wl,-rpath=. when type is "application"', function () {
            var flag = '-Wl,-rpath=.';

            shouldNotDecorateLinkerFlags(flag, {
                host: 'linux',
                type: 'static-library'
            });
            shouldNotDecorateLinkerFlags(flag, {
                host: 'linux-make-clang-linux-x86',
                type: 'static-library'
            });
            shouldNotDecorateLinkerFlags(flag, {
                host: 'linux-make-clang-linux-x64',
                type: 'static-library'
            });
            shouldNotDecorateLinkerFlags(flag, {
                host: 'linux-make-gcc-linux-x86',
                type: 'static-library'
            });
            shouldNotDecorateLinkerFlags(flag, {
                host: 'linux-make-gcc-linux-x64',
                type: 'static-library'
            });

            shouldNotDecorateLinkerFlags(flag, {
                host: 'linux',
                type: 'dynamic-library'
            });
            shouldNotDecorateLinkerFlags(flag, {
                host: 'linux-make-clang-linux-x86',
                type: 'dynamic-library'
            });
            shouldNotDecorateLinkerFlags(flag, {
                host: 'linux-make-clang-linux-x64',
                type: 'dynamic-library'
            });
            shouldNotDecorateLinkerFlags(flag, {
                host: 'linux-make-gcc-linux-x86',
                type: 'dynamic-library'
            });
            shouldNotDecorateLinkerFlags(flag, {
                host: 'linux-make-gcc-linux-x64',
                type: 'dynamic-library'
            });
        });
    });
});
