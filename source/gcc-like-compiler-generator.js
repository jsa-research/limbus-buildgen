
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014-2016 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

exports.compilerCommand = function (compiler, options) {
    var extraFlags = '';
    if (options.includePaths !== undefined) {
        var separator = ' -I';
        extraFlags += separator + options.includePaths.join(separator);
    }
    if (options.flags !== undefined) {
        extraFlags += ' ' + options.flags;
    }
    if (options.type === 'dynamic-library') {
        extraFlags += ' -fpic';
    }
    return compiler + ' -c ' + options.file + ' -o ' + options.file + '.o' + extraFlags;
};

exports.linkerCommand = function (compiler, options) {
    var extraFlags = '';
    if (options.flags !== undefined) {
        extraFlags += options.flags;
    }
    if (options.libraries !== undefined) {
        var separator = ' -L./ -l';
        extraFlags += separator + options.libraries.join(separator);
    }
    if (options.libraryPaths !== undefined) {
        var separator = ' -L';
        extraFlags += separator + options.libraryPaths.join(separator);
    }

    var outputPath = options.outputPath || '';
    var objectFiles = options.files.join('.o ') + '.o';

    if (options.type === 'static-library') {
        return 'ar rcs' + extraFlags + ' ' + outputPath + 'lib' + options.outputName + '.a ' + objectFiles;

    } else if (options.type === 'dynamic-library') {
        return compiler + ' -shared -o ' + outputPath + 'lib' + options.outputName + '.so ' + objectFiles + ' ' + extraFlags;

    } else {
        return compiler + ' -o ' + outputPath + options.outputName + ' ' + objectFiles + ' ' + extraFlags;
    }
};
