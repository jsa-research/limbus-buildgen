
var _ = require('./underscore');

exports.string = function (object, property, required) {
    var not_string_error = _.camelToSnakeCase(property) + '_is_not_a_string';
    var value = object[property];
    if (required) {
        if (value === undefined) {
            throw new Error('no_' + _.camelToSnakeCase(property));
        }
    }

    if (value !== undefined && typeof value !== 'string') {
        throw new Error(not_string_error);
    }
};

exports.stringArray = function (object, property, required) {
    var not_string_array_error = _.camelToSnakeCase(property) + '_is_not_a_string_array';
    var value = object[property];
    if (value !== undefined && !Array.isArray(value)) {
        throw new Error(not_string_array_error);
    }
    if (required) {
        if (value === undefined || value.length === 0) {
            throw new Error('no_' + _.camelToSnakeCase(property));
        }
    }
    if (value !== undefined) {
        value.forEach(function (file) {
            if (typeof file !== 'string') {
                throw new Error(not_string_array_error);
            }
        });
    }
};
