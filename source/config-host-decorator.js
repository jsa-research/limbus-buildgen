
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014-2016 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

var hostNeedsRpath = function (host) {
    return host !== 'win32' &&
           host !== 'win32-make-cl-win32-x86' &&
           host !== 'win32-make-cl-win32-x64' &&
           host !== 'darwin' &&
           host !== 'darwin-make-clang-darwin-x86' &&
           host !== 'darwin-make-clang-darwin-x64' &&
           host !== 'darwin-make-gcc-darwin-x86' &&
           host !== 'darwin-make-gcc-darwin-x64';
};

var hostIs32Bit = function (host) {
    return host === 'darwin' ||
           host === 'linux' ||
           host === 'freebsd' ||
           host === 'darwin-make-gcc-darwin-x86' ||
           host === 'darwin-make-clang-darwin-x86' ||
           host === 'linux-make-gcc-linux-x86' ||
           host === 'linux-make-clang-linux-x86' ||
           host === 'freebsd-make-clang-freebsd-x86';
};

var hostIs64Bit = function (host) {
    return host === 'darwin-make-gcc-darwin-x64' ||
           host === 'darwin-make-clang-darwin-x64' ||
           host === 'linux-make-gcc-linux-x64' ||
           host === 'linux-make-clang-linux-x64' ||
           host === 'freebsd-make-gcc-freebsd-x64' ||
           host === 'freebsd-make-clang-freebsd-x64';
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
        var architecture;

        if (hostNeedsRpath(configuration.host)) {
            addRpathToArtifactLinkerFlags(artifact);
        }

        if (hostIs32Bit(configuration.host)) {
            architecture = '32';
            addArchitectureFlagToArtifactLinkerFlags(artifact, architecture);
            addArchitectureFlagToArtifactCompilerFlags(artifact, architecture);
        }

        if (hostIs64Bit(configuration.host)) {
            architecture = '64';
            addArchitectureFlagToArtifactLinkerFlags(artifact, architecture);
            addArchitectureFlagToArtifactCompilerFlags(artifact, architecture);
        }
    });

    return configuration;
};
