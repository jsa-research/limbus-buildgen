
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

var typeCheck = require('./type-check');

exports.inject = function (compiler, exports) {
    exports.compilerCommand = function (options) {
        typeCheck.string(options, 'file', 'required');
        typeCheck.string(options, 'flags');
        typeCheck.stringArray(options, 'includePaths');

        var extraFlags = '';
        if (options.includePaths !== undefined) {
            var separator = ' -I';
            extraFlags += separator + options.includePaths.join(separator);
        }
        if (options.flags !== undefined) {
            extraFlags += ' ' + options.flags;
        }
        return compiler + ' -c ' + options.file + ' -o ' + options.file + '.o' + extraFlags;
    };

    exports.linkerCommand = function (options) {
        typeCheck.string(options, 'type', 'required');
        if (options.type !== 'static-library' && options.type !== 'application') {
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
        if (options.libraries !== undefined) {
            var separator = ' -L./ -l';
            extraFlags += separator + options.libraries.join(separator);
        }
        if (options.flags !== undefined) {
            extraFlags += ' ' + options.flags;
        }

        var command;
        var outputName;
        if (options.type === 'application') {
            command = compiler + ' -o ';
            outputName = options.outputName;
        } else {
            command = 'ar rcs ';
            outputName = 'lib' + options.outputName + '.a';
        }
        return command + outputName + ' ' + options.objectFiles.join(' ') + extraFlags;
    };
};
