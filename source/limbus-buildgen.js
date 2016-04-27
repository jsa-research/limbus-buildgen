
var makefileGenerator = require('./makefile-generator');

module.exports.generate = function (configuration) {
    return {
        'Makefile': {
            isFile: true,
            contents: makefileGenerator.generate(configuration.artifacts[0])
        }
    };
};
