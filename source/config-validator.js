
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014-2016 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

var requiredProjectProperties = [
    'title',
    'artifacts'
];

var optionalProjectProperties = [];

var requiredProperties = [
    'title',
    'type',
    'host',
    'files',
    'outputName'
];

var optionalProperties = [
    'outputPath',
    'compilerFlags',
    'linkerFlags',
    'includePaths',
    'libraryPaths',
    'libraries'
];

var validTypes = [
    'application',
    'dynamic-library',
    'static-library'
];

var validHosts = [
    'linux',
    'linux-make-clang-linux-x86',
    'linux-make-clang-linux-x64',
    'linux-make-gcc-linux-x86',
    'linux-make-gcc-linux-x64',
    'darwin',
    'darwin-make-clang-darwin-x86',
    'darwin-make-clang-darwin-x64',
    'darwin-make-gcc-darwin-x86',
    'darwin-make-gcc-darwin-x64',
    'win32',
    'win32-make-cl-win32-x86',
    'win32-make-cl-win32-x64',
    'freebsd',
    'freebsd-make-clang-freebsd-x86',
    'freebsd-make-clang-freebsd-x64',
    'freebsd-make-gcc-freebsd-x64',
];

var stringProjectProperties = [
    'title'
];

var stringProperties = [
    'title',
    'outputName',
    'outputPath',
    'compilerFlags',
    'linkerFlags'
];

var stringArrayProperties = [
    'files',
    'includePaths',
    'libraryPaths',
    'libraries'
];

var ConfigValidator = function () {};

var _ = require('./publicdash');

var returnErrorOn = function (configuration, properties, error, predicate) {
    return _.reduce(properties, function (result, property) {
        return predicate(property) ? {
            valid: false,
            error: error,
            property: property
        } : result;
    }, {valid: true});
};

var validateRequiredProperties = function (config) {
    return returnErrorOn(config, requiredProperties, 'missing required property', function (property) {
        return config[property] === undefined;
    });
};

var validateRequiredProjectProperties = function (config) {
    return returnErrorOn(config, requiredProjectProperties, 'missing required project property', function (property) {
        return config[property] === undefined;
    });
};

var validateStringProperties = function (config) {
    return returnErrorOn(config, stringProperties, 'property is not a string', function (property) {
        return config[property] !== undefined && typeof config[property] !== 'string';
    });
};

var validateStringProjectProperties = function (config) {
    return returnErrorOn(config, stringProjectProperties, 'project property is not a string', function (property) {
        return config[property] !== undefined && typeof config[property] !== 'string';
    });
};

var arrayContainsNonString = function (array) {
    var index;
    for (index = 0; index < array.length; index += 1) {
        var value = array[index];
        if (typeof value !== 'string') {
            return true;
        }
    }
    return false;
};

var validateStringArrayProperties = function (config) {
    return returnErrorOn(config, stringArrayProperties, 'property is not a string array', function (property) {
        return config[property] !== undefined &&
            (!Array.isArray(config[property]) || arrayContainsNonString(config[property]));
    });
};

var validateFilenames = function (config) {
    return returnErrorOn(config, ['outputName'], 'cannot be path', function (property) {
        return config[property].match(/[\/\\]/) !== null ||
            config[property] === '.' ||
            config[property] === '..';
    });
};

var validateFileArrays = function (config) {
    return returnErrorOn(config, ['files'], 'no input files', function (property) {
        return config[property].length === 0;
    });
};

var validateUnknownProperties = function (requiredProperties, optionalProperties, error) {
    return function (config) {
        for (var property in config) {
            if (config.hasOwnProperty(property)) {
                if (requiredProperties.indexOf(property) === -1 &&
                    optionalProperties.indexOf(property) === -1) {
                    return {
                        valid: false,
                        error: error,
                        property: property
                    };
                }
            }
        }

        return {
            valid: true
        };
    };
};

var validateForInvalidValues = function (config) {
    var isValidValue = function (validValues, value) {
        return validValues.indexOf(value) !== -1;
    };

    if (!isValidValue(validTypes, config.type)) {
        return {
            valid: false,
            error: 'invalid property',
            property: 'type'
        };
    }

    if (!isValidValue(validHosts, config.host)) {
        return {
            valid: false,
            error: 'invalid property',
            property: 'host'
        };
    }

    return {
        valid: true
    };
};

var validateFileExtensions = function (config) {
    return _.reduce(config.files, function (result, file) {
        if (result.valid && file.match(/\.\w/) === null) {
            return {
                valid: false,
                error: 'no extension',
                property: 'files'
            };
        }
        return result;
    }, {valid: true});
};

var validateMiscConstraints = function (config) {
    if (config.type === 'static-library' && (config.libraries !== undefined && config.libraries.length > 0)) {
        return {
            valid: false,
            error: 'given libraries with static-library',
            property: 'libraries'
        };
    }

    return {
        valid: true
    };
};

ConfigValidator.validate = function (config) {
    var validators = [
        validateUnknownProperties(requiredProperties, optionalProperties, 'unknown property'),
        validateRequiredProperties,
        validateForInvalidValues,
        validateStringProperties,
        validateStringArrayProperties,
        validateFileExtensions,
        validateFilenames,
        validateFileArrays,
        validateMiscConstraints
    ];

    var projectValidators = [
        validateUnknownProperties(requiredProjectProperties, optionalProjectProperties, 'unknown project property'),
        validateRequiredProjectProperties,
        validateStringProjectProperties
    ];

    var validate = function (config, validators, startingResult) {
        return _.reduce(validators, function (result, validator) {
            return result.valid ? validator(config) : result;
        }, startingResult);
    };

    var projectValidation = validate(config, projectValidators, {valid: true});

    return _.reduce(config.artifacts, function (result, artifact) {
        return result.valid ? validate(artifact, validators, result) : result;
    }, projectValidation);
};

module.exports = ConfigValidator;
