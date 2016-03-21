
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2016 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

var requiredProperties = [
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
    'libraries'
];

var validTypes = [
    'application',
    'dynamic-library',
    'static-library'
];

var validHosts = [
    'linux',
    'linux-clang',
    'linux-gcc',
    'darwin',
    'darwin-clang',
    'darwin-gcc',
    'win32',
    'win32-cl',
    'freebsd',
    'freebsd-clang',
    'freebsd-gcc'
];

var stringProperties = [
    'outputName',
    'outputPath',
    'compilerFlags',
    'linkerFlags'
];

var stringArrayProperties = [
    'files',
    'includePaths',
    'libraries'
];

var ConfigValidator = function () {};

var _ = require('./publicdash');

var validateRequiredProperties = function (config) {
    return _.reduce(requiredProperties, function (result, property) {
        if (result.valid && config[property] === undefined) {
            result.valid = false;
            result.error = 'missing ' + property;
        }
        return result;
    }, {valid: true});
};

var validateForInvalidValues = function (config) {
    var isValidValue = function (validValues, value) {
        return validValues.indexOf(value) !== -1;
    };

    if (!isValidValue(validTypes, config.type)) {
        return {
            valid: false,
            error: 'invalid type'
        };
    }

    if (!isValidValue(validHosts, config.host)) {
        return {
            valid: false,
            error: 'invalid host'
        };
    }

    return {
        valid: true
    };
};

var validateStringProperties = function (config) {
    return _.reduce(stringProperties, function (result, property) {
        if (result.valid && config[property] !== undefined && typeof config[property] !== 'string') {
            result.valid = false;
            result.error = property + ' is not a string';
        }
        return result;
    }, {valid: true});
};

var validateStringArrayProperties = function (config) {
    var arrayContainsNonString = function (array) {
        var index;
        for (index = 0; index < array.length; ++index) {
            var value = array[index];
            if (typeof value !== 'string') {
                return true;
            }
        }
        return false;
    };

    return _.reduce(stringArrayProperties, function (result, property) {
        if (result.valid &&
            config[property] !== undefined &&
            (!Array.isArray(config[property]) || arrayContainsNonString(config[property]))) {
            result.valid = false;
            result.error = property + ' is not a string array';
        }
        return result;
    }, {valid: true});
};

var validateProperties = function (config) {
    for (var property in config) {
        if (config.hasOwnProperty(property)) {
            if (requiredProperties.indexOf(property) === -1 &&
                optionalProperties.indexOf(property) === -1) {
                return {
                    valid: false,
                    error: 'unknown property',
                    property: property
                };
            }
        }
    }

    return {
        valid: true
    };
};

ConfigValidator.validate = function (config) {
    var validators = [
        validateRequiredProperties,
        validateForInvalidValues,
        validateStringProperties,
        validateStringArrayProperties,
        validateProperties
    ];

    return _.reduce(validators, function (result, validator) {
        if (result.valid) {
            return validator(config);
        } else {
            return result;
        }
    }, {valid: true});
};

module.exports = ConfigValidator;
