
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

print(makefile_generator.generate({
    files: [
        'dependencies/duktape-1.0.0/src/duktape.c',
        'dependencies/duktape-1.0.0/examples/cmdline/duk_cmdline.c'
    ],
    includePaths: [
        'dependencies/duktape-1.0.0/src/'
    ],
    outputName: 'duk'
}));
