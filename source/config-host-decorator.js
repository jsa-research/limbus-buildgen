
module.exports.decorate = function (configuration) {
    for (var artifactIndex = 0; artifactIndex < configuration.artifacts.length; artifactIndex++) {
        var artifact = configuration.artifacts[artifactIndex];

        if (artifact.type === 'application') {
            if (artifact.host !== 'win32' &&
                artifact.host !== 'win32-make-cl-win32-x86' &&
                artifact.host !== 'win32-make-cl-win32-x64' &&
                artifact.host !== 'darwin' &&
                artifact.host !== 'darwin-make-clang-darwin-x86' &&
                artifact.host !== 'darwin-make-clang-darwin-x64' &&
                artifact.host !== 'darwin-make-gcc-darwin-x86' &&
                artifact.host !== 'darwin-make-gcc-darwin-x64') {

                artifact.linkerFlags = (artifact.linkerFlags || '') + ' -lm -Wl,-rpath=.';
            }
        }

        if (artifact.host === 'darwin' ||
            artifact.host === 'linux' ||
            artifact.host === 'freebsd' ||
            artifact.host === 'darwin-make-gcc-darwin-x86' ||
            artifact.host === 'darwin-make-clang-darwin-x86' ||
            artifact.host === 'linux-make-gcc-linux-x86' ||
            artifact.host === 'linux-make-clang-linux-x86' ||
            artifact.host === 'freebsd-make-clang-freebsd-x86') {

            if (artifact.type !== 'static-library') {
                artifact.linkerFlags = (artifact.linkerFlags || '') + ' -m32';
            }
            artifact.compilerFlags = (artifact.compilerFlags || '') + ' -m32';
        }

        if (artifact.host === 'darwin-make-gcc-darwin-x64' ||
            artifact.host === 'darwin-make-clang-darwin-x64' ||
            artifact.host === 'linux-make-gcc-linux-x64' ||
            artifact.host === 'linux-make-clang-linux-x64' ||
            artifact.host === 'freebsd-make-gcc-freebsd-x64' ||
            artifact.host === 'freebsd-make-clang-freebsd-x64') {

            if (artifact.type !== 'static-library') {
                artifact.linkerFlags = (artifact.linkerFlags || '') + ' -m64';
            }
            artifact.compilerFlags = (artifact.compilerFlags || '') + ' -m64';
        }
    }

    return configuration;
};
