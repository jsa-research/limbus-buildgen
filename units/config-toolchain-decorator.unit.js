
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014-2016 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

'use strict';

require('should');
var ConfigToolchainDecorator = require('../source/config-toolchain-decorator');
var minimal = require('../source/minimal-configuration');

var shouldDecorateLinkerFlags = function (flags, toolchain) {
    var configuration = minimal.projectWith({ toolchain: toolchain });
    ConfigToolchainDecorator.decorate(configuration);
    configuration.artifacts[0].linkerFlags.should.containEql(flags);
};

var shouldNotDecorateLinkerFlags = function (flags, toolchain, type) {
    var configuration = minimal.projectWith({
        toolchain: toolchain,
        artifacts: [minimal.artifactWith({ type: type })]
    });
    ConfigToolchainDecorator.decorate(configuration);
    if (configuration.artifacts[0].linkerFlags !== undefined) {
        configuration.artifacts[0].linkerFlags.should.not.containEql(flags);
    }
};

var shouldNotDecorateAnything = function (toolchain) {
    var configuration = minimal.projectWith({ toolchain: toolchain });
    ConfigToolchainDecorator.decorate(configuration);
    configuration.should.deepEqual(minimal.projectWith({ toolchain: toolchain }));
};

var shouldLinkWithFlagGivenToolchain = function (flag, toolchain) {
    it('should link with ' + flag + ' given ' + toolchain, function () {
        shouldDecorateLinkerFlags(flag, toolchain);
    });
};

var shouldCompileWithFlagGivenToolchain = function (flag, toolchain) {
    it('should compile with ' + flag + ' given ' + toolchain, function () {
        var configuration = minimal.projectWith({ toolchain: toolchain });
        ConfigToolchainDecorator.decorate(configuration);
        configuration.artifacts[0].compilerFlags.should.containEql(flag);
    });
};

describe('config-toolchain-decorator', function () {
    it('should decorate all artifacts', function () {
        var configuration = minimal.projectWith({
            toolchain: 'linux',
            artifacts: [
                minimal.artifactWith({}),
                minimal.artifactWith({})
            ]
        });
        ConfigToolchainDecorator.decorate(configuration);
        configuration.artifacts[1].linkerFlags.should.containEql('-lm');
    });

    it('should keep any existing linkerFlags', function () {
        var configuration = minimal.projectWith({
            toolchain: 'linux',
            artifacts: [
                minimal.artifactWith({ linkerFlags: '-linkflag' })
            ]
        });
        ConfigToolchainDecorator.decorate(configuration);
        configuration.artifacts[0].linkerFlags.should.containEql('-linkflag');
    });

    describe('configuration where toolchain OS is win32', function () {
        it('should not decorate', function () {
            shouldNotDecorateAnything('win32');
            shouldNotDecorateAnything('win32-make-cl-win32-x86');
            shouldNotDecorateAnything('win32-make-cl-win32-x64');
        });
    });

    describe('configuration where toolchain OS is freebsd', function () {
        it('should link with libm by default', function () {
            var flag = '-lm';
            shouldDecorateLinkerFlags(flag, 'freebsd');
            shouldDecorateLinkerFlags(flag, 'freebsd-make-clang-freebsd-x86');
            shouldDecorateLinkerFlags(flag, 'freebsd-make-clang-freebsd-x64');
            shouldDecorateLinkerFlags(flag, 'freebsd-make-gcc-freebsd-x64');
        });

        it('should link with -Wl,-rpath=. using LLVM Clang or GNU GCC', function () {
            var flag = '-Wl,-rpath=.';

            shouldDecorateLinkerFlags(flag, 'freebsd');
            shouldDecorateLinkerFlags(flag, 'freebsd-make-clang-freebsd-x86');
            shouldDecorateLinkerFlags(flag, 'freebsd-make-clang-freebsd-x64');
            shouldDecorateLinkerFlags(flag, 'freebsd-make-gcc-freebsd-x64');
        });

        it('should only link with -Wl,-rpath=. when type is "application"', function () {
            var flag = '-Wl,-rpath=.';

            shouldNotDecorateLinkerFlags(flag, 'freebsd', 'static-library');
            shouldNotDecorateLinkerFlags(flag, 'freebsd-make-clang-freebsd-x86', 'static-library');
            shouldNotDecorateLinkerFlags(flag, 'freebsd-make-clang-freebsd-x64', 'static-library');
            shouldNotDecorateLinkerFlags(flag, 'freebsd-make-gcc-freebsd-x64', 'static-library');

            shouldNotDecorateLinkerFlags(flag, 'freebsd', 'dynamic-library');
            shouldNotDecorateLinkerFlags(flag, 'freebsd-make-clang-freebsd-x86', 'dynamic-library');
            shouldNotDecorateLinkerFlags(flag, 'freebsd-make-clang-freebsd-x64', 'dynamic-library');
            shouldNotDecorateLinkerFlags(flag, 'freebsd-make-gcc-freebsd-x64', 'dynamic-library');
        });
    });

    describe('configuration where toolchain OS is linux', function () {
        it('should link with libm by default', function () {
            var flag = '-lm';

            shouldDecorateLinkerFlags(flag, 'linux');
            shouldDecorateLinkerFlags(flag, 'linux-make-clang-linux-x86');
            shouldDecorateLinkerFlags(flag, 'linux-make-clang-linux-x64');
            shouldDecorateLinkerFlags(flag, 'linux-make-gcc-linux-x86');
            shouldDecorateLinkerFlags(flag, 'linux-make-gcc-linux-x64');
        });

        it('should link with -Wl,-rpath=. using LLVM Clang or GNU GCC', function () {
            var flag = '-Wl,-rpath=.';

            shouldDecorateLinkerFlags(flag, 'linux');
            shouldDecorateLinkerFlags(flag, 'linux-make-clang-linux-x86');
            shouldDecorateLinkerFlags(flag, 'linux-make-clang-linux-x64');
            shouldDecorateLinkerFlags(flag, 'linux-make-gcc-linux-x86');
            shouldDecorateLinkerFlags(flag, 'linux-make-gcc-linux-x64');
        });

        it('should only link with -Wl,-rpath=. when type is "application"', function () {
            var flag = '-Wl,-rpath=.';

            shouldNotDecorateLinkerFlags(flag, 'linux', 'static-library');
            shouldNotDecorateLinkerFlags(flag, 'linux-make-clang-linux-x86', 'static-library');
            shouldNotDecorateLinkerFlags(flag, 'linux-make-clang-linux-x64', 'static-library');
            shouldNotDecorateLinkerFlags(flag, 'linux-make-gcc-linux-x86', 'static-library');
            shouldNotDecorateLinkerFlags(flag, 'linux-make-gcc-linux-x64', 'static-library');

            shouldNotDecorateLinkerFlags(flag, 'linux', 'dynamic-library');
            shouldNotDecorateLinkerFlags(flag, 'linux-make-clang-linux-x86', 'dynamic-library');
            shouldNotDecorateLinkerFlags(flag, 'linux-make-clang-linux-x64', 'dynamic-library');
            shouldNotDecorateLinkerFlags(flag, 'linux-make-gcc-linux-x86', 'dynamic-library');
            shouldNotDecorateLinkerFlags(flag, 'linux-make-gcc-linux-x64', 'dynamic-library');
        });
    });

    describe('Architecture flags', function () {
        var flag = '-m32';
        shouldLinkWithFlagGivenToolchain(flag, 'linux');
        shouldLinkWithFlagGivenToolchain(flag, 'linux-make-clang-linux-x86');
        shouldLinkWithFlagGivenToolchain(flag, 'linux-make-gcc-linux-x86');
        shouldLinkWithFlagGivenToolchain(flag, 'freebsd');
        shouldLinkWithFlagGivenToolchain(flag, 'freebsd-make-clang-freebsd-x86');
        shouldLinkWithFlagGivenToolchain(flag, 'darwin');
        shouldLinkWithFlagGivenToolchain(flag, 'darwin-make-clang-darwin-x86');
        shouldLinkWithFlagGivenToolchain(flag, 'darwin-make-gcc-darwin-x86');

        shouldCompileWithFlagGivenToolchain(flag, 'linux');
        shouldCompileWithFlagGivenToolchain(flag, 'linux-make-clang-linux-x86');
        shouldCompileWithFlagGivenToolchain(flag, 'linux-make-gcc-linux-x86');
        shouldCompileWithFlagGivenToolchain(flag, 'freebsd');
        shouldCompileWithFlagGivenToolchain(flag, 'freebsd-make-clang-freebsd-x86');
        shouldCompileWithFlagGivenToolchain(flag, 'darwin');
        shouldCompileWithFlagGivenToolchain(flag, 'darwin-make-clang-darwin-x86');
        shouldCompileWithFlagGivenToolchain(flag, 'darwin-make-gcc-darwin-x86');

        flag = '-m64';
        shouldLinkWithFlagGivenToolchain(flag, 'linux-make-clang-linux-x64');
        shouldLinkWithFlagGivenToolchain(flag, 'linux-make-gcc-linux-x64');
        shouldLinkWithFlagGivenToolchain(flag, 'freebsd-make-clang-freebsd-x64');
        shouldLinkWithFlagGivenToolchain(flag, 'freebsd-make-gcc-freebsd-x64');
        shouldLinkWithFlagGivenToolchain(flag, 'darwin-make-clang-darwin-x64');
        shouldLinkWithFlagGivenToolchain(flag, 'darwin-make-gcc-darwin-x64');

        shouldCompileWithFlagGivenToolchain(flag, 'linux-make-clang-linux-x64');
        shouldCompileWithFlagGivenToolchain(flag, 'linux-make-gcc-linux-x64');
        shouldCompileWithFlagGivenToolchain(flag, 'freebsd-make-clang-freebsd-x64');
        shouldCompileWithFlagGivenToolchain(flag, 'freebsd-make-gcc-freebsd-x64');
        shouldCompileWithFlagGivenToolchain(flag, 'darwin-make-clang-darwin-x64');
        shouldCompileWithFlagGivenToolchain(flag, 'darwin-make-gcc-darwin-x64');

        it('should not pass architecture flags to ar', function () {
            shouldNotDecorateLinkerFlags('-m32', 'linux-make-gcc-linux-x86', 'static-library');
            shouldNotDecorateLinkerFlags('-m64', 'linux-make-gcc-linux-x64', 'static-library');
        });
    });
});
