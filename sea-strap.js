
// sea-strap.js - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014 by Jesper Oskarsson jesosk@gmail.com
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

if (process.argv.length < 3) {
    console.log('Missing config file');
    process.exit(-1);
} else {
    var configPath = process.argv[process.argv.length - 1];
    var flags = process.argv.slice(2, -1);

    var config = JSON.parse(fs.readFileSync(configPath));

    for (var i = 0; i < flags.length; i += 2) {
        var flag = flags[i];

        if (i + 1 >= flags.length) {
            console.log('Flag missing value');
            process.exit(-1);

        } else {
            var value = flags[i + 1];

            if (flag === '--host') {
                config.host = value;
            } else {
                console.log('Unknown flag', flag);
                process.exit(-1);
            }
        }
    }

    fs.writeFileSync("Makefile", makefile_generator.generate(config));
}
