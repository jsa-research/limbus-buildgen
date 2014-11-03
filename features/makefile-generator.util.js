
// sea-strap.js - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

var makefile_generator = require('../source/makefile-generator');
var shell = require('shelljs');

exports.shouldCompileAndRun = function (config, runCommand, done) {
    makefile_generator.generate(config).to('Makefile');

    var make;
    if (config.host === 'win32') {
        make = 'nmake /f Makefile';
    } else {
        make = 'make'
        runCommand += './';
    }

    shell.exec(make, {silent: true}, function (returnValue, output) {
        if (returnValue !== 0) {
            throw new Error(output);
        }

        shell.exec(runCommand, {silent: true}, function (returnValue, output) {
            if (returnValue !== 0) {
                throw new Error(output);
            }

            done();
        });
    });
};

exports.setupEnvironment = function (done) {
    shell.mkdir('temp');
    shell.cd('temp');
    done();
};

exports.teardownEnvironment = function (done) {
    setTimeout(function () {
        shell.cd('..');
        shell.rm('-Rf', 'temp');
        done();
    }, 500);
};
