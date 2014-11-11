
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
var exec = require('child_process').exec;
var fs = require('fs');

exports.mkdir = function (path, workingDirectory, performAction, callback) {
    exec('mkdir ' + path, {cwd: workingDirectory}, function (error, stdout, stderr) {
        if (error === null) {
            var completionHandler = function (result) {
                exec('rm -Rf ' + path, {cwd: workingDirectory}, function (error, stdout, stderr) {
                    if (error === null) {
                        return callback(result);
                    } else {
                        return callback(error);
                    }
                });
            };

            return performAction(completionHandler);
        } else {
            return callback(error);
        }
    });
};

var setupTestEnvironment = function (performWork, callback) {
    exports.mkdir('temp', null, function (callback) {
        return exports.mkdir('source', 'temp', function (callback) {
            return exports.mkdir('include', 'temp', function (callback) {
                return exec('cp source/*.js temp/source/', null, function (error, stdout, stderr) {
                    if (error !== null) {
                        return callback(error);
                    } else {
                        return performWork(callback);
                    }
                });
            }, callback);
        }, callback);
    }, callback);
};

var compileAndRun = function (host, command, workingDirectory, callback) {
    var make;
    var relativeExecutablePrefix = '';
    if (host === 'win32') {
        make = 'nmake /f Makefile';
    } else {
        make = 'make'
        relativeExecutablePrefix = './';
    }

    return exec(make, {cwd: workingDirectory}, function (error, stdout, stderr) {
        if (error !== null) {
            return callback(error);
        }

        return exec(relativeExecutablePrefix + command, {cwd: workingDirectory}, function (error, stdout, stderr) {
            if (error !== null) {
                return callback(error);
            }

            return callback();
        });
    });
};

exports.generateCompileAndRun = function (config, done) {
    setupTestEnvironment(function (callback) {
        var buildConfig;
        
        if (typeof config.config === 'string') {
            buildConfig = config.config;
        } else {
            buildConfig = JSON.stringify(config.config);
        }
        
        fs.writeFileSync('temp/build_config.json', buildConfig);

        return exec('../duk ../sea-strap.js ' + (config.parameters || '') + ' build_config.json', {cwd: 'temp'}, function (error, stdout, stderr) {
            if (error !== null) {
                return callback(error);
            }

            try {
                config.setup();
            } catch (e) {
                return callback(e);
            }

            return compileAndRun(config.config.host, config.command, 'temp', callback);
        });
    }, done);
};
