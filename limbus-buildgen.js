
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014-2016 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

var duktape_version = '1.0.1';
var makefile_generator = require('./source/makefile-generator');
var fs = require('fs');

var getValue = function (flags, index) {
    if (index + 1 >= flags.length) {
        console.log('Flag ' + flags[index] + ' is missing a value');
        process.exit(-1);
    }

    return flags[index + 1];
};

var flags = process.argv.slice(2);
var makefile,
    configPath,
    host;

for (var i = 0; i < flags.length; ++i) {
    var flag = flags[i];

    if (flag.substr(0, 2) !== '--') {
        if (configPath === undefined) {
            configPath = flag;
        } else {
            console.log('Too many arguments');
            process.exit(-1);
        }

    } else if (flag === '--host') {
        host = getValue(flags, i);
        i += 1;

    } else if (flag === '--buildFile') {
        makefile = getValue(flags, i);
        i += 1;

    } else if (flag === '--help') {
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

    } else {
        console.log("Unknown flag '" + flag + "'");
        process.exit(-1);
    }
}

if (!configPath) {
    console.log("No configuration file");
    process.exit(-1);
}

var config = JSON.parse(fs.readFileSync(configPath));

if (host !== undefined) {
    config.host = host;
}

try {
    var generatedMakefile = makefile_generator.generate(config);
    fs.writeFileSync(makefile || "Makefile", generatedMakefile);
} catch (e) {
    if (e.message === 'unknown_config_property') {
        console.log("Unknown property '" + e.unknownProperty + "' in configuration");
    } else {
        console.log(e);
    }
    process.exit(-1);
}
