
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014-2016 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

var makefileGenerator = require('./makefile-generator');
var fs = require('fs');

var exitWithError = function (error) {
    console.log(error);
    process.exit(-1);
};

var argumentIsFlag = function (argument) {
    return argument.substr(0, 2) === '--';
};

var getFlagValue = function (flags, index) {
    if (index + 1 >= flags.length) {
        exitWithError('Flag ' + flags[index] + ' is missing a value');
    }

    return flags[index + 1];
};

var argumentsToSlice;
if (process.argv[0].indexOf('duk') !== -1) {
    argumentsToSlice = 1;
} else {
    argumentsToSlice = 2;
}

var processArguments = process.argv.slice(argumentsToSlice);
var makefile,
    configPath,
    host;

var setConfigPath = function (path) {
    if (configPath === undefined) {
        configPath = path;
    } else {
        exitWithError('Too many arguments');
    }
};

var flagHandlers = {
    '--host': function (i) {
        host = getFlagValue(processArguments, i);
    },
    '--buildFile': function (i) {
        makefile = getFlagValue(processArguments, i);
    },
    '--help': function () {
        console.log("\n" +
                    "Usage: ./duk limbus-buildgen.js [flags] <path to JSON configuration file>\n" +
                    "\n" +
                    "Options:\n" +
                    "\n" +
                    "  --help                          output usage information\n" +
                    "  --host <host>                   override the configured target host\n" +
                    "  --buildFile <path>              specify the path and filename for the\n" +
                    "                                  generated build file (default: ./Makefile)\n");
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

if (!configPath) {
    exitWithError("No configuration file");
}

var config = JSON.parse(fs.readFileSync(configPath));

if (host !== undefined) {
    config.host = host;
}

try {
    var generatedMakefile = makefileGenerator.generate(config);
    fs.writeFileSync(makefile || "Makefile", generatedMakefile);
} catch (e) {
    exitWithError(e);
}
