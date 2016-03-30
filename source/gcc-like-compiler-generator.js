
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

exports.inject = function (compiler, exports) {
    exports.compilerCommand = function (options) {
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

    exports.linkerCommand = function (options) {
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
        if (options.type === 'static-library') {
            command = 'ar rcs ';
            outputName = 'lib' + options.outputName + '.a';
        } else if (options.type === 'dynamic-library') {
            command = compiler + ' -shared -o ';
            outputName = 'lib' + options.outputName + '.so';
        } else {
            command = compiler + ' -o ';
            outputName = options.outputName;
        }

        var outputPath;
        if (options.outputPath) {
            outputPath = options.outputPath.replace(/\/$/, '') + '/';
        } else {
            outputPath = '';
        }

        return command + outputPath + outputName + ' ' + options.objectFiles.join(' ') + extraFlags;
    };
};
