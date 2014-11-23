
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

var compile = function (makefile, workingDirectory, done) {
    var make;
    if (process.platform === 'win32') {
        make = 'nmake /f ' + (makefile || 'Makefile');
    } else {
        make = 'make -f ' + (makefile || 'Makefile')
    }

    shell.exec(make, {cwd: workingDirectory}, done);
};

var generate = function (config, parameters, done) {
    var buildConfig;
    if (typeof config === 'string') {
        buildConfig = config;
    } else {
        buildConfig = JSON.stringify(config);
    }

    fs.writeFileSync('temp/build_config.json', buildConfig);

    return shell.exec(shell.path('../duk') + ' ' + shell.path('../limbus-buildgen.js') + ' ' + (parameters || '') + ' build_config.json', {cwd: 'temp'}, done);
};

exports.generateCompileAndRun = function (options, done) {
    var parameters = options.parameters;
    var setup = options.setup;
    var makefile = options.makefile;
    var command = options.command;
    var expectOutputToMatch = options.expectOutputToMatch;

    setupTestEnvironment(function (callback) {
        var generateOneConfig = function (config, index, callback) {
            return generate(config, parameters, function (error) {
                if (error !== null) {
                    return callback(error);
                }

                setup();
                return compile(makefile, 'temp', function (error) {
                    if (error !== null) {
                        return callback(error);
                    }

                    if (config.type !== 'static-library') {
                        return shell.exec(shell.path('./') + command, {cwd: 'temp'}, function (error, stdout, stderr) {
                            if (error !== null) {
                                return callback(error);
                            }
                            
                            if (expectOutputToMatch && !stdout.match(expectOutputToMatch)) {
                                return callback(new Error("Output '" + stdout + "' does not match " + expectOutputToMatch));
                            }

                            return callback();
                        });
                    } else {
                        return callback();
                    }
                });
            });
        };
        
        if (Array.isArray(options.config)) {
            return exports.forEachAsync(options.config, generateOneConfig, callback);
        } else {
            return generateOneConfig(options.config, 0, callback);
        }
    }, done);
};

exports.forEachAsync = function (array, callback, done) {
    function next(index) {
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
