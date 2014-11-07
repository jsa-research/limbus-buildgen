
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
} else {
    var configPath = process.argv[2];
    
    if (process.argv.length > 4) {
        console.log('Too many arguments!');
    } else {
        console.log(makefile_generator.generate(JSON.parse(fs.readFileSync(configPath))));
    }
}
