
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

                if (artifact.linkerFlags === undefined) {
                    artifact.linkerFlags = '';
                }

                artifact.linkerFlags += ' -lm -Wl,-rpath=.';
            }
        }
    }

    return configuration;
};
