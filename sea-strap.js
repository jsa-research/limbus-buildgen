
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

var printHosts = function () {
    console.log('\nSupported hosts are:');

    makefile_generator.supportedHosts.forEach(function (host) {
        console.log('  * ' + host);
    });

    console.log('');
};

if (process.argv.length < 3) {
    console.log('Missing host');
    printHosts();
} else {
    var host = process.argv[2];
    
    var compilerFlags;
    if (process.argv.length > 3) {
        compilerFlags = process.argv.slice(3).join(' ');
    }

    if (makefile_generator.supportedHosts.indexOf(host) !== -1) {
        console.log(makefile_generator.generate({
            files: [
                'dependencies/duktape-' + duktape_version + '/src/duktape.c',
                'source/duk.c',
                'source/platform.c'
            ],
            includePaths: [
                'dependencies/duktape-' + duktape_version + '/src/'
            ],
            outputName: 'duk',
            compilerFlags: compilerFlags,
            host: host
        }));
    } else {
        console.log('Invalid host');
        printHosts();
    }
}
