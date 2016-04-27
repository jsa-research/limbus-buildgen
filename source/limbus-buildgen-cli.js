
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014-2016 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

var buildgen = require('./limbus-buildgen');
var fs = require('fs');

var parsedArguments = parseArguments(process.argv.slice(1));

var config = JSON.parse(fs.readFileSync(parsedArguments.configPath));

if (parsedArguments.host !== undefined) {
    config.artifacts[0].host = parsedArguments.host;
}

try {
    var files = buildgen.generate(config);

    for (var path in files) {
        var file = files[path];
        if (file.isFile) {
            fs.writeFileSync((parsedArguments.outputPath || '.') + '/' + path, file.contents);
        }
    }
} catch (e) {
    exitWithError(e);
}

function parseArguments (processArguments) {
    var result = {};

    var flagHandlers = {
        '--host': function (i) {
            result.host = getFlagValue(processArguments, i);
        },
        '--outputPath': function (i) {
            result.outputPath = getFlagValue(processArguments, i);
        },
        '--help': function () {
            console.log("\n" +
                        "Usage: limbus-buildgen [flags] <path to JSON configuration file>\n" +
                        "\n" +
                        "Options:\n" +
                        "\n" +
                        "  --help                          output usage information\n" +
                        "  --host <host>                   override the configured target host\n" +
                        "  --outputPath <path>             specify the path where build files are written\n" +
                        "                                  to (default: .)");
            process.exit(0);
        }
    };

    for (var i = 0; i < processArguments.length; i+=2) {
        var argument = processArguments[i];

        if (!argumentIsFlag(argument)) {
            setConfigPath(argument);
            i -= 1;

        } else {
            var flagHandler = flagHandlers[argument];
            if (flagHandler) {
                flagHandler(i);
            } else {
                exitWithError("Unknown flag '" + argument + "'");
            }
        }
    }

    if (!result.configPath) {
        exitWithError("No configuration file");
    }

    return result;

    function argumentIsFlag (argument) {
        return argument.substr(0, 2) === '--';
    };

    function getFlagValue (flags, index) {
        if (index + 1 >= flags.length) {
            exitWithError('Flag ' + flags[index] + ' is missing a value');
        }

        return flags[index + 1];
    };

    function setConfigPath (path) {
        if (result.configPath === undefined) {
            result.configPath = path;
        } else {
            exitWithError('Too many arguments');
        }
    };
};

function exitWithError (error) {
    console.log(error);
    process.exit(-1);
};
