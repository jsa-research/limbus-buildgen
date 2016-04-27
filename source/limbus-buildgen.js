
var ConfigValidator = require('./config-validator');
var ConfigPathNormalizer = require('./config-path-normalizer');
var makefileGenerator = require('./makefile-generator');

module.exports.generate = function (configuration) {
    var validationResult = ConfigValidator.validate(configuration);

    if (validationResult.valid === false) {
        throw new Error(validationResult.error + ': ' + validationResult.property);
    }

    ConfigPathNormalizer.normalize(configuration);

    return {
        'Makefile': {
            isFile: true,
            contents: makefileGenerator.generate(configuration.artifacts[0])
        }
    };
};
