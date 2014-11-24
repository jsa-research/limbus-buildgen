
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

var _ = require('./underscore');

var checkStringArray = function (value, error_on_not_string_array, error_on_empty_or_undefined) {
    if (value !== undefined && !Array.isArray(value)) {
        throw new Error(error_on_not_string_array);
    }
    if (error_on_empty_or_undefined) {
        if (value === undefined || value.length === 0) {
            throw new Error(error_on_empty_or_undefined);
        }
    }
    if (value !== undefined) {
        value.forEach(function (file) {
            if (typeof file !== 'string') {
                throw new Error(error_on_not_string_array);
            }
        });
    }
};

var processPath = function (path) {
    return path.replace(/\//g, '\\');
};

exports.compilerCommand = function (options) {
    if (options.file === undefined) {
        throw new Error('no_file');
    }
    if (typeof options.file !== 'string') {
        throw new Error('file_is_not_a_string');
    }
    checkStringArray(options.includePaths, 'include_paths_is_not_a_string_array');
    
    var includePaths = '';
    if (options.includePaths) {
        includePaths += '/I' + _.map(options.includePaths, processPath).join(' /I');
    }
    var processedFile = processPath(options.file);
    var match = processedFile.match(/^([^\.]+)\.\w+$/);
    return 'cl /c /Fe' + match[1] + '.obj ' + includePaths + ' ' + processedFile;
};

exports.linkerCommand = function (options) {
    if (options.type !== 'application' && options.type !== 'static-library') {
        throw new Error('invalid_type');
    }
    if (options.outputName === undefined) {
        throw new Error('no_output_name');
    }
    if (typeof options.outputName !== 'string') {
        throw new Error('output_name_is_not_a_string');
    }
    checkStringArray(options.objectFiles, 'object_files_is_not_a_string_array', 'no_object_files');
    checkStringArray(options.libraries, 'libraries_is_not_a_string_array');

    var libraries = '';
    if (options.libraries) {
        libraries += options.libraries.join('.lib ') + '.lib ';
    }
    
    var command,
        outputNameSuffix;
    if (options.type === 'static-library') {
        command = 'lib /OUT:';
        outputNameSuffix = '.lib';
    } else {
        command = 'cl /Fe';
        outputNameSuffix = '';
    }

    return command + options.outputName + outputNameSuffix + ' ' + libraries + _.map(options.objectFiles, processPath).join(' ');
};
