
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014-2016 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

'use strict';

exports.variables = function (options) {
    return {
        CC: options.compiler,
        AR: 'ar'
    };
};

var compilerFlagsFromOptions = function (options) {
    var flags = '';

    if (options.includePaths !== undefined) {
        var separator = ' -I';
        flags += separator + options.includePaths.join(separator);
    }

    if (options.type === 'dynamic-library') {
        flags += ' -fpic';
    }

    if (options.flags !== undefined) {
        flags += ' ' + options.flags;
    }

    return flags;
};

exports.compilerCommand = function (options) {
    return '$(CC) -c ' + options.file + ' -o ' + options.file + '.o' + compilerFlagsFromOptions(options);
};

var linkerFlagsFromOptions = function (options) {
    var separator = '';
    var flags = '';

    if (options.libraries !== undefined) {
        separator = ' -L./ -l';
        flags += separator + options.libraries.join(separator);
    }

    if (options.libraryPaths !== undefined) {
        separator = ' -L';
        flags += separator + options.libraryPaths.join(separator);
    }

    if (options.flags !== undefined) {
        flags += ' ' + options.flags;
    }

    return flags;
};

var objectFilesFromFiles = function (files) {
    return files.join('.o ') + '.o';
};

var linkerCommandFromOptions = function (options) {
    if (options.type === 'static-library') {
        return '$(AR) rcs' + options.flags + ' ' + options.outputPath + 'lib' + options.outputName + '.a ' + options.objectFiles;

    } else if (options.type === 'dynamic-library') {
        return '$(CC) -shared -o ' + options.outputPath + 'lib' + options.outputName + '.so ' + options.objectFiles + ' ' + options.flags;

    } else {
        return '$(CC) -o ' + options.outputPath + options.outputName + ' ' + options.objectFiles + ' ' + options.flags;
    }
};

exports.linkerCommand = function (options) {
    return linkerCommandFromOptions({
        type: options.type,
        outputPath: options.outputPath || '',
        outputName: options.outputName,
        objectFiles: objectFilesFromFiles(options.files),
        flags: linkerFlagsFromOptions(options)
    });
};
