
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

exports.hygenicFolder = function (config, performAction, callback) {
    shell.exec('mkdir ' + config.path, {silent: true}, function (returnValue, output) {
        if (config.changeDirectory) {
            shell.cd(config.path);
        }
        performAction(function () {
            if (config.changeDirectory) {
                shell.cd(config.path.replace(/[^\/]+/, '..'));
            }
            shell.rm('-Rf', config.path);
            callback();
        });
    });
};

exports.shouldCompileAndRun = function (setup, config, runCommand, done) {
    exports.hygenicFolder({path: 'temp', changeDirectory: true}, function (done) {
        JSON.stringify(config).to('build_config.json');

        var make;
        var relativeExecutablePrefix = '';
        if (config.host === 'win32') {
            make = 'nmake /f Makefile';
        } else {
            make = 'make'
            relativeExecutablePrefix = './';
        }

        exports.hygenicFolder({path: 'source'}, function (done) {
            shell.cp('../source/*.js', './source/');

            shell.exec('../duk ../sea-strap.js build_config.json > Makefile', {silent: true}, function (returnValue, output) {
                if (returnValue !== 0) {
                    throw new Error(output);
                }

                setup(function () {
                    shell.exec(make, {silent: true}, function (returnValue, output) {
                        if (returnValue !== 0) {
                            throw new Error(output);
                        }

                        shell.exec(relativeExecutablePrefix + runCommand, {silent: true}, function (returnValue, output) {
                            if (returnValue !== 0) {
                                throw new Error(output);
                            }

                            done();
                        });
                    });
                });
            });
        }, done);
    }, done);
};
