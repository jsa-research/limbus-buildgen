
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

var makefile_generator = require('../source/makefile-generator');
var shell = require('../source/shell');
var fs = require('fs');

var setupTestEnvironment = function (performWork, callback) {
    shell.mkdirClean('temp', null, function (callback) {
        return shell.mkdirClean('source', 'temp', function (callback) {
            return shell.mkdirClean('include', 'temp', function (callback) {
                return shell.cp('source/*.js', 'temp/source/', null, function (error) {
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

var compileAndRun = function (config, workingDirectory, callback) {
    var make;
    if (process.platform === 'win32') {
        make = 'nmake /f ' + (config.makefile || 'Makefile');
    } else {
        make = 'make -f ' + (config.makefile || 'Makefile')
    }

    return shell.exec(make, {cwd: workingDirectory}, function (error, stdout, stderr) {
        if (error !== null) {
            return callback(error);
        }

        return shell.exec(shell.path('./') + config.command, {cwd: workingDirectory}, function (error, stdout, stderr) {
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

        return shell.exec(shell.path('../duk') + ' ' + shell.path('../limbus-buildgen.js') + ' ' + (config.parameters || '') + ' build_config.json', {cwd: 'temp'}, function (error, stdout, stderr) {
            if (error !== null) {
                return callback(error);
            }

            config.setup();
            return compileAndRun(config, 'temp', callback);
        });
    }, done);
};

exports.forEachAsync = function (array, callback, done) {
    var next = function (index) {
        if (index < array.length) {
            return callback(array[index], index, function (error) {
                if (error) {
                    return done(error);
                } else {
                    return next(index + 1);
                }
            });
        } else {
            return done();
        }
    };
    
    return next(0);
};
