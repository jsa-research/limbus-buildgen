
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014-2016 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

var makefile_generator = require('../source/makefile-generator');
var shell = require('./shell');
var fs = require('fs');

exports.hostCompiler = (process.env.BUILDGEN_TARGET_COMPILER ? process.env.BUILDGEN_TARGET_COMPILER : undefined);

// Defines default values for hostCompiler based on platform.
if (exports.hostCompiler === undefined) {
    if (process.platform === 'win32') {
        exports.hostCompiler = 'cl';
    } else if (process.platform === 'linux') {
        exports.hostCompiler = 'gcc';
    } else {
        exports.hostCompiler = 'clang';
    }
}

exports.host = process.platform + '-' + exports.hostCompiler;

var writeFile = function (path, dataPromise) {
    return new Promise(function(resolve, reject) {
        dataPromise.then(function (data) {
            fs.writeFile(path, data, function (error) {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    });
};
exports.writeFile = writeFile;

var readFile = function (path) {
    return new Promise(function(resolve, reject) {
        fs.readFile(path, function (error, data) {
            if (error) {
                reject(error);
            } else {
                resolve(data.toString());
            }
        });
    });
};
exports.readFile = readFile;

exports.frontEndExecutable = shell.path('./limbus-buildgen');

exports.beforeEach = function () {
    return shell.mkdir('temp').then(function () {
        return shell.mkdir('temp/source');
    }).then(function () {
        return shell.cp('source/*.js', 'temp/source/');
    }).then(function () {
        return shell.copyFiles([
            'simple.c'
        ], 'features/common/', 'temp/');
    });
};

exports.afterEach = function () {
    return shell.rm('temp');
};

var generate = function (config, parameters) {
    var buildConfig;
    if (typeof config === 'string') {
        buildConfig = config;
    } else {
        buildConfig = JSON.stringify(config);
    }

    return writeFile('temp/build_config.json', Promise.resolve(buildConfig)).then(function () {
        return shell.exec(shell.path('../limbus-buildgen') + ' ' + (parameters || '') + ' build_config.json', {cwd: 'temp'});
    });
};

var compile = function (makefile) {
    var make;
    if (process.platform === 'win32') {
        make = '..\\utility-scripts\\setenv.bat && nmake /f ' + (makefile || 'Makefile');
    } else {
        make = 'make -f ' + (makefile || 'Makefile')
    }

    return shell.exec(make, {cwd: 'temp'});
};

var execute = function (type, command, expectOutputToMatch) {
    if (type !== 'application') {
        return Promise.resolve();
    }

    return shell.exec(shell.path('./' + command), {cwd: 'temp'}).then(function (result) {
        if (expectOutputToMatch && !result.stdout.match(expectOutputToMatch)) {
            return Promise.reject(new Error("Output '" + result.stdout + "' does not match " + expectOutputToMatch));
        } else {
            return Promise.resolve();
        }
    });
};

exports.generateCompileAndRun = function (options) {
    var promiseForConfig = function (config) {
        return generate(config, options.parameters).then(function () {
            return compile(options.makefile);
        }).then(function () {
            return execute(config.type, options.command, options.expectOutputToMatch);
        });
    };

    if (Array.isArray(options.config)) {
        var promise = Promise.resolve();

        options.config.forEach(function (config) {
            promise = promise.then(function () {
                return promiseForConfig(config);
            });
        });

        return promise;
    } else {
        return promiseForConfig(options.config);
    }
};

exports.buildSimple = function (config, command) {
    command = command || config.outputName;

    return exports.generateCompileAndRun({
        setup: function () {
            return exports.copyFiles([
                'simple.c'
            ], 'features/front-end/', 'temp/');
        },
        config: config,
        command: command,
        expectOutputToMatch: '42',
        parameters: ''
    });
};

exports.minimalArtifact = function () {
    return {
        title: 'app',
        type: 'application',
        host: exports.host,
        files: ['main.c'],
        outputName: 'app'
    };
};

exports.minimalArtifactWith = function (properties) {
    var artifact = exports.minimalArtifact();
    return Object.assign(artifact, properties);
};

exports.minimalProject = function () {
    return {
        title: 'project',
        artifacts: [exports.minimalArtifact()]
    };
};

exports.minimalProjectWith = function (properties) {
    var project = exports.minimalProject();
    return Object.assign(project, properties);
};

exports.minimalProjectWithArtifactProperties = function (properties) {
    return exports.minimalProjectWith({
        artifacts: [exports.minimalArtifactWith(properties)]
    });
};
