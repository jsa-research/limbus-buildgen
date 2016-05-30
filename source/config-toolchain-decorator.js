
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014-2016 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

var toolchainNeedsRpath = function (toolchain) {
    return toolchain !== 'win32' &&
           toolchain !== 'win32-make-cl-win32-x86' &&
           toolchain !== 'win32-make-cl-win32-x64' &&
           toolchain !== 'darwin' &&
           toolchain !== 'darwin-make-clang-darwin-x86' &&
           toolchain !== 'darwin-make-clang-darwin-x64' &&
           toolchain !== 'darwin-make-gcc-darwin-x86' &&
           toolchain !== 'darwin-make-gcc-darwin-x64';
};

var toolchainIs32Bit = function (toolchain) {
    return toolchain === 'darwin' ||
           toolchain === 'linux' ||
           toolchain === 'freebsd' ||
           toolchain === 'darwin-make-gcc-darwin-x86' ||
           toolchain === 'darwin-make-clang-darwin-x86' ||
           toolchain === 'linux-make-gcc-linux-x86' ||
           toolchain === 'linux-make-clang-linux-x86' ||
           toolchain === 'freebsd-make-clang-freebsd-x86';
};

var toolchainIs64Bit = function (toolchain) {
    return toolchain === 'darwin-make-gcc-darwin-x64' ||
           toolchain === 'darwin-make-clang-darwin-x64' ||
           toolchain === 'linux-make-gcc-linux-x64' ||
           toolchain === 'linux-make-clang-linux-x64' ||
           toolchain === 'freebsd-make-gcc-freebsd-x64' ||
           toolchain === 'freebsd-make-clang-freebsd-x64';
};

var addRpathToArtifactLinkerFlags = function (artifact) {
    if (artifact.type === 'application') {
        artifact.linkerFlags = (artifact.linkerFlags || '') + ' -lm -Wl,-rpath=.';
    }
};

var addArchitectureFlagToArtifactLinkerFlags = function (artifact, architecture) {
    if (artifact.type !== 'static-library') {
        artifact.linkerFlags = (artifact.linkerFlags || '') + ' -m' + architecture;
    }
};

var addArchitectureFlagToArtifactCompilerFlags = function (artifact, architecture) {
    artifact.compilerFlags = (artifact.compilerFlags || '') + ' -m' + architecture;
};

module.exports.decorate = function (configuration) {
    configuration.artifacts.forEach(function (artifact) {
        var architecture = '';

        if (toolchainNeedsRpath(configuration.toolchain)) {
            addRpathToArtifactLinkerFlags(artifact);
        }

        if (toolchainIs32Bit(configuration.toolchain)) {
            architecture = '32';
            addArchitectureFlagToArtifactLinkerFlags(artifact, architecture);
            addArchitectureFlagToArtifactCompilerFlags(artifact, architecture);
        }

        if (toolchainIs64Bit(configuration.toolchain)) {
            architecture = '64';
            addArchitectureFlagToArtifactLinkerFlags(artifact, architecture);
            addArchitectureFlagToArtifactCompilerFlags(artifact, architecture);
        }
    });

    return configuration;
};
