
// limbus-buildgen - A 'build anywhere' C/C++ makefile/project generator.
// Written in 2014-2016 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

'use strict';

var buildgen = require('../source/limbus-buildgen');
var fs = require('fs');

var exitWithError = function (error) {
    console.log(error);
    process.exit(-1);
};

var getFlagValue = function (flags, index) {
    if (index + 1 >= flags.length) {
        exitWithError('Flag ' + flags[index] + ' is missing a value');
    }

    return flags[index + 1];
};

var flagHandlers = {
    '--toolchain': function (result, processArguments, index) {
        result.toolchain = getFlagValue(processArguments, index);
    },
    '--outputPath': function (result, processArguments, index) {
        result.outputPath = getFlagValue(processArguments, index);
    },
    '--help': function () {
        console.log('\n' +
            'Usage: limbus-buildgen [flags] <path to JSON configuration file>\n' +
            '\n' +
            'Options:\n' +
            '\n' +
            '  --help                          output usage information\n' +
            '  --toolchain <toolchain>         override the configured target toolchain\n' +
            '  --outputPath <path>             specify the path where build files are written\n' +
            '                                  to (default: .)');
        process.exit(0);
    }
};

var argumentIsFlag = function (argument) {
    return argument.substr(0, 2) === '--';
};

var parseArguments = function (processArguments) {
    var result = {};

    for (var index = 0; index < processArguments.length; index += 2) {
        var argument = processArguments[index];

        if (!argumentIsFlag(argument)) {
            if (result.configPath === undefined) {
                result.configPath = argument;
            } else {
                exitWithError('Too many arguments');
            }
            index -= 1;

        } else {
            var flagHandler = flagHandlers[argument];

            if (flagHandler) {
                flagHandler(result, processArguments, index);
            } else {
                exitWithError('Unknown flag "' + argument + '"');
            }
        }
    }

    if (!result.configPath) {
        exitWithError('No configuration file');
    }

    return result;
};

var parsedArguments = parseArguments(process.argv.slice(1));

var config = JSON.parse(fs.readFileSync(parsedArguments.configPath));

if (parsedArguments.toolchain !== undefined) {
    config.toolchain = parsedArguments.toolchain;
}

try {
    var files = buildgen.generate(config);

    for (var path in files) {
        if (files.hasOwnProperty(path)) {
            var file = files[path];
            if (file.isFile) {
                fs.writeFileSync((parsedArguments.outputPath || '.') + '/' + path, file.contents);
            }
        }
    }
} catch (error) {
    exitWithError(error);
}
