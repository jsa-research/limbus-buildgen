
var makefileGenerator = require('./makefile-generator');

module.exports.generate = function (projectName, configs) {
    return {
        'Makefile': {
            isFile: true,
            contents: makefileGenerator.generate(configs[0])
        }
    };
};
