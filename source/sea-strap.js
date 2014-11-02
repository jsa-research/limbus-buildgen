
// sea-strap.js - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

var makefile_generator = require('source/makefile-generator');

/* Standard values */
var files = [
    'dependencies/duktape-1.0.0/src/duktape.c',
    'source/duk.c'
];
var includePaths = [
    'dependencies/duktape-1.0.0/src/'
];
var outputName = 'duk';

var configs = {
    generic: {
        files: files,
        includePaths: includePaths,
        outputName: outputName
    },
    freebsd: {
        files: files,
        includePaths: includePaths,
        outputName: outputName,
        host: 'freebsd'
    }
};

var printConfigs = function () {
    print("\nCan be one of the following:");
    for (var key in configs) {
        print("  * " + key);
    }
    print("");
};

if (arguments.length < 3) {
    print("Missing config name\n");
    printConfigs();
} else {
    var config_name = arguments[2];

    if (configs[config_name] !== undefined) {
        print(makefile_generator.generate(configs[config_name]));
    } else {
        print("Invalid config");
        printConfigs();
    }
}
