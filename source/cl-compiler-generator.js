
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014-2016 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

var dash = require('./publicdash');

var changeToValidPath = function (path) {
    return (path || '').replace(/\//g, '\\');
};

exports.variables = function () {
    return {
        CC: 'cl',
        AR: 'lib'
    };
};

var compilerFlagsFromOptions = function (options) {
    var flags = '';
    if (options.includePaths) {
        flags += ' /I' + dash.map(options.includePaths, changeToValidPath).join(' /I');
    }
    if (options.type === 'dynamic-library') {
        flags += ' /D_USRDLL /D_WINDLL';
    }
    if (options.flags !== undefined) {
        flags += ' ' + options.flags;
    }
    return flags + ' ';
};

exports.compilerCommand = function (options) {
    var compiledFile = changeToValidPath(options.file);
    return '$(CC) /nologo /c /Fo' +
           compiledFile + '.obj' +
           compilerFlagsFromOptions(options) +
           compiledFile;
};

var generateLinkerFlags = function (options) {
    var flags = '';
    if (options.libraryPaths !== undefined) {
        var separator = ' /LIBPATH:';
        flags += separator + options.libraryPaths.join(separator);
    }
    if (options.flags !== undefined) {
        flags += ' ' + options.flags;
    }
    return flags;
};

var linkerCommandPrefixFromType = function (type) {
    if (type === 'static-library') {
        return '$(AR) /nologo /OUT:';
    } else if (type === 'dynamic-library') {
        return '$(CC) /nologo /LD /Fe';
    } else {
        return '$(CC) /nologo /Fe';
    }
};

var outputNameSuffixFromType = function (type) {
    if (type === 'static-library') {
        return '.lib ';
    } else if (type === 'dynamic-library') {
        return '.dll ';
    } else {
        return ' ';
    }
};

var librariesToLinkFromOptions = function (options) {
    if (options.libraries !== undefined) {
        return ' ' + options.libraries.join('.lib ') + '.lib';
    } else {
        return '';
    }
};

var objectFilesFromFiles = function (files) {
    return dash.map(files, changeToValidPath).join('.obj ') + '.obj';
}

exports.linkerCommand = function (options) {
    return linkerCommandPrefixFromType(options.type) +
           changeToValidPath(options.outputPath) +
           options.outputName +
           outputNameSuffixFromType(options.type) +
           objectFilesFromFiles(options.files) +
           librariesToLinkFromOptions(options) +
           ' /link' + generateLinkerFlags(options);
};
