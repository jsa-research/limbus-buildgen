
// sea-strap.js - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

var fs = require('fs');

function readJSON(file) {
    return JSON.parse(fs.readFileSync(file));
}

var first = readJSON(process.argv[2]);
var rest = process.argv.slice(3);

rest.forEach(function (file) {
    var json = readJSON(file);
    first.source_files = first.source_files.concat(json.source_files);
});

console.log(JSON.stringify(first));
