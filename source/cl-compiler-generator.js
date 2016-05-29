
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014-2016 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

var _ = require('./publicdash');

var processPath = function (path) {
    return path.replace(/\//g, '\\');
};

exports.variables = function () {
    return {
        CC: 'cl',
        AR: 'lib'
    };
};

exports.compilerCommand = function (options) {
    var extraFlags = '';
    if (options.includePaths) {
        extraFlags += ' /I' + _.map(options.includePaths, processPath).join(' /I');
    }
    if (options.type === 'dynamic-library') {
        extraFlags += ' /D_USRDLL /D_WINDLL';
    }
    if (options.flags !== undefined) {
        extraFlags += ' ' + options.flags;
    }

    var processedFile = processPath(options.file);
    return '$(CC) /nologo /c /Fo' + processedFile + '.obj' + extraFlags + ' ' + processedFile;
};

exports.linkerCommand = function (options) {
    var libraries = '';
    if (options.libraries !== undefined) {
        libraries += ' ' + options.libraries.join('.lib ') + '.lib';
    }

    var extraFlags = '';
    if (options.libraryPaths !== undefined) {
        var separator = ' /LIBPATH:';
        extraFlags += separator + options.libraryPaths.join(separator);
    }
    if (options.flags !== undefined) {
        extraFlags += ' ' + options.flags;
    }

    var command,
        outputNameSuffix;
    if (options.type === 'static-library') {
        command = '$(AR) /nologo /OUT:';
        outputNameSuffix = '.lib';
    } else if (options.type === 'dynamic-library') {
        command = '$(CC) /nologo /LD /Fe';
        outputNameSuffix = '.dll';
    } else {
        command = '$(CC) /nologo /Fe';
        outputNameSuffix = '';
    }

    var outputPath = options.outputPath || '';

    return command + processPath(outputPath) + options.outputName + outputNameSuffix + ' ' + _.map(options.files, processPath).join('.obj ') + '.obj' + libraries + ' /link' + extraFlags;
};
