
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
var typeCheck = require('./type-check');

var processPath = function (path) {
    return path.replace(/\//g, '\\');
};

exports.compilerCommand = function (options) {
    typeCheck.string(options, 'file', 'required');
    typeCheck.string(options, 'flags');
    typeCheck.stringArray(options, 'includePaths');

    var extraFlags = '';
    if (options.includePaths) {
        extraFlags += ' /I' + _.map(options.includePaths, processPath).join(' /I');
    }
    if (options.flags) {
        extraFlags += ' ' + options.flags;
    }
    var processedFile = processPath(options.file);
    var match = processedFile.match(/^(.+)\.\w+$/);
    return 'cl /c /Fo' + match[1] + '.obj' + extraFlags + ' ' + processedFile;
};

exports.linkerCommand = function (options) {
    if (options.type !== 'application' && options.type !== 'static-library') {
        throw new Error('invalid_type');
    }
    typeCheck.string(options, 'outputName', 'required');
    typeCheck.string(options, 'flags');
    typeCheck.stringArray(options, 'objectFiles', 'required');
    typeCheck.stringArray(options, 'libraries');

    if (options.type === 'static-library' &&
        options.libraries !== undefined &&
        options.libraries.length > 0) {
        throw new Error('linking_libraries_is_not_valid_for_static_libraries');
    }
    
    var extraFlags = '';
    if (options.libraries) {
        extraFlags += ' ' + options.libraries.join('.lib ') + '.lib';
    }
    if (options.flags) {
        extraFlags += ' ' + options.flags;
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

    return command + options.outputName + outputNameSuffix + extraFlags + ' ' + _.map(options.objectFiles, processPath).join(' ');
};
