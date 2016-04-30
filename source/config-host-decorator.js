
module.exports.decorate = function (configuration) {
    for (var artifactIndex = 0; artifactIndex < configuration.artifacts.length; artifactIndex++) {
        var artifact = configuration.artifacts[artifactIndex];

        if (artifact.type === 'application') {
            if (artifact.host !== 'win32' &&
                artifact.host !== 'win32-cl' &&
                artifact.host !== 'darwin' &&
                artifact.host !== 'darwin-gcc' &&
                artifact.host !== 'darwin-clang') {
                if (artifact.linkerFlags === undefined) {
                    artifact.linkerFlags = '';
                }
                artifact.linkerFlags += ' -lm -Wl,-rpath=.';
            }
        }
    }

    return configuration;
};
