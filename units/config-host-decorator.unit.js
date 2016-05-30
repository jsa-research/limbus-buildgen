
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014-2016 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

require('should');
var ConfigHostDecorator = require('../source/config-host-decorator');
var minimal = require('../source/minimal-configuration');

var shouldDecorateLinkerFlags = function (flags, host) {
    var configuration = minimal.projectWith({ host: host });
    ConfigHostDecorator.decorate(configuration);
    configuration.artifacts[0].linkerFlags.should.containEql(flags);
};

var shouldNotDecorateLinkerFlags = function (flags, host, type) {
    var configuration = minimal.projectWith({
        host: host,
        artifacts: [minimal.artifactWith({ type: type })]
    });
    ConfigHostDecorator.decorate(configuration);
    if (configuration.artifacts[0].linkerFlags !== undefined) {
        configuration.artifacts[0].linkerFlags.should.not.containEql(flags);
    }
};

var shouldNotDecorateAnything = function (host) {
    var configuration = minimal.projectWith({ host: host });
    ConfigHostDecorator.decorate(configuration);
    configuration.should.deepEqual(minimal.projectWith({ host: host }));
};

var shouldLinkWithFlagGivenHost = function (flag, host) {
    it('should link with ' + flag + ' given ' + host, function () {
        shouldDecorateLinkerFlags(flag, host);
    });
};

var shouldCompileWithFlagGivenHost = function (flag, host) {
    it('should compile with ' + flag + ' given ' + host, function () {
        var configuration = minimal.projectWith({ host: host });
        ConfigHostDecorator.decorate(configuration);
        configuration.artifacts[0].compilerFlags.should.containEql(flag);
    });
};

describe('config-host-decorator', function () {
    it('should decorate all artifacts', function () {
        var configuration = minimal.projectWith({
            host: 'linux',
            artifacts: [
                minimal.artifactWith({}),
                minimal.artifactWith({})
            ]
        });
        ConfigHostDecorator.decorate(configuration);
        configuration.artifacts[1].linkerFlags.should.containEql('-lm');
    });

    it('should keep any existing linkerFlags', function () {
        var configuration = minimal.projectWith({
            host: 'linux',
            artifacts: [
                minimal.artifactWith({ linkerFlags: '-linkflag' })
            ]
        });
        ConfigHostDecorator.decorate(configuration);
        configuration.artifacts[0].linkerFlags.should.containEql('-linkflag');
    });

    describe('configuration where host OS is win32', function () {
        it('should not decorate', function () {
            shouldNotDecorateAnything('win32');
            shouldNotDecorateAnything('win32-make-cl-win32-x86');
            shouldNotDecorateAnything('win32-make-cl-win32-x64');
        });
    });

    describe('configuration where host OS is freebsd', function () {
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

    describe('configuration where host OS is linux', function () {
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
        shouldLinkWithFlagGivenHost(flag, 'linux');
        shouldLinkWithFlagGivenHost(flag, 'linux-make-clang-linux-x86');
        shouldLinkWithFlagGivenHost(flag, 'linux-make-gcc-linux-x86');
        shouldLinkWithFlagGivenHost(flag, 'freebsd');
        shouldLinkWithFlagGivenHost(flag, 'freebsd-make-clang-freebsd-x86');
        shouldLinkWithFlagGivenHost(flag, 'darwin');
        shouldLinkWithFlagGivenHost(flag, 'darwin-make-clang-darwin-x86');
        shouldLinkWithFlagGivenHost(flag, 'darwin-make-gcc-darwin-x86');

        shouldCompileWithFlagGivenHost(flag, 'linux');
        shouldCompileWithFlagGivenHost(flag, 'linux-make-clang-linux-x86');
        shouldCompileWithFlagGivenHost(flag, 'linux-make-gcc-linux-x86');
        shouldCompileWithFlagGivenHost(flag, 'freebsd');
        shouldCompileWithFlagGivenHost(flag, 'freebsd-make-clang-freebsd-x86');
        shouldCompileWithFlagGivenHost(flag, 'darwin');
        shouldCompileWithFlagGivenHost(flag, 'darwin-make-clang-darwin-x86');
        shouldCompileWithFlagGivenHost(flag, 'darwin-make-gcc-darwin-x86');

        flag = '-m64';
        shouldLinkWithFlagGivenHost(flag, 'linux-make-clang-linux-x64');
        shouldLinkWithFlagGivenHost(flag, 'linux-make-gcc-linux-x64');
        shouldLinkWithFlagGivenHost(flag, 'freebsd-make-clang-freebsd-x64');
        shouldLinkWithFlagGivenHost(flag, 'freebsd-make-gcc-freebsd-x64');
        shouldLinkWithFlagGivenHost(flag, 'darwin-make-clang-darwin-x64');
        shouldLinkWithFlagGivenHost(flag, 'darwin-make-gcc-darwin-x64');

        shouldCompileWithFlagGivenHost(flag, 'linux-make-clang-linux-x64');
        shouldCompileWithFlagGivenHost(flag, 'linux-make-gcc-linux-x64');
        shouldCompileWithFlagGivenHost(flag, 'freebsd-make-clang-freebsd-x64');
        shouldCompileWithFlagGivenHost(flag, 'freebsd-make-gcc-freebsd-x64');
        shouldCompileWithFlagGivenHost(flag, 'darwin-make-clang-darwin-x64');
        shouldCompileWithFlagGivenHost(flag, 'darwin-make-gcc-darwin-x64');

        it('should not pass architecture flags to ar', function () {
            shouldNotDecorateLinkerFlags('-m32', 'linux-make-gcc-linux-x86', 'static-library');
            shouldNotDecorateLinkerFlags('-m64', 'linux-make-gcc-linux-x64', 'static-library');
        });
    });
});
