
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014-2016 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

var shell = require('./shell');
var fs = require('fs');

exports.hostCompiler = (process.env.BUILDGEN_TARGET_COMPILER ? process.env.BUILDGEN_TARGET_COMPILER : undefined);
exports.hostArchitecture = (process.env.BUILDGEN_TARGET_ARCHITECTURE ? process.env.BUILDGEN_TARGET_ARCHITECTURE : undefined);

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

// Defines default values for hostArchitecture based on platform architecture.
if (exports.hostArchitecture === undefined) {
    if (process.arch === 'ia32') {
        exports.hostArchitecture = 'x86';
    } else {
        exports.hostArchitecture = process.arch;
    }
}

// Creates a host value that specifies the target compiler/architecture falling back to platform defaults if not specified.
exports.host = process.platform + '-make-' + exports.hostCompiler + '-' + process.platform + '-' + exports.hostArchitecture;

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

exports.frontEndExecutable = shell.path('../generated/limbus-buildgen');

exports.beforeEach = function () {
    return shell.mkdir('temp').then(function () {
        return shell.mkdir('temp/source');
    }).then(function () {
        return shell.cp('source/*.js', 'temp/source/');
    }).then(function () {
        return shell.copyFiles([
            'main.c'
        ], 'features/common/', 'temp/');
    });
};

exports.afterEach = function () {
    return shell.rm('temp');
};

exports.writeConfiguration = function (configuration) {
    var configurationString = configuration;
    if (typeof configurationString !== 'string') {
        configurationString = JSON.stringify(configurationString);
    }
    var file = 'configuration.json';
    return exports.writeFile('temp/' + file, Promise.resolve(configurationString)).then(function () {
        return Promise.resolve({
            configuration: configuration,
            configurationPath: file
        });
    });
};

var findExecutableFromConfiguration = function (configuration) {
    for (var artifactIndex = 0; artifactIndex < configuration.artifacts.length; artifactIndex++) {
        var artifact = configuration.artifacts[artifactIndex];
        if (artifact.type === 'application') {
            return (artifact.outputPath !== undefined && artifact.outputPath.length > 0 ? shell.path(artifact.outputPath + '/') : shell.path('./')) + artifact.outputName;
        }
    }
};

exports.generateWithParameters = function (parameters) {
    return function (configurationDetails) {
        return shell.exec(exports.frontEndExecutable + (parameters ? ' ' + parameters : '') + ' ' + configurationDetails.configurationPath, {cwd: 'temp'})
        .then(function () {
            return Promise.resolve({
                makefile: 'Makefile',
                executable: findExecutableFromConfiguration(configurationDetails.configuration)
            });
        });
    }
};

exports.build = function (makefile, variables) {
    return function (buildDetails) {
        var variableDefinitions = '';
        for (var variableName in variables) {
            if (variables.hasOwnProperty(variableName)) {
                if (exports.hostCompiler === 'cl') {
                    variableDefinitions += 'set ' + variableName + '=' + variables[variableName] + '&& ';
                } else {
                    variableDefinitions += variableName + '=\'' + variables[variableName] + '\' ';
                }
            }
        }

        var command = '';
        if (exports.hostCompiler === 'cl') {
            command += variableDefinitions;
            command += '..\\utility-scripts\\setenv.bat ' + process.env.BUILDGEN_TARGET_ARCHITECTURE + '&& ';
            command += 'nmake';
            if (variableDefinitions.length > 0) {
                command += ' /E'
            }
            command += ' /f ' + (makefile || buildDetails.makefile);
        } else {
            command += 'make ';
            command += variableDefinitions;
            command += '-f ' + (makefile || buildDetails.makefile);
        }

        return shell.exec(command, {cwd: 'temp'}).then(function () {
            return Promise.resolve(buildDetails.executable);
        });
    };
};

exports.runBuiltExecutable = function (executableOverride) {
    return function (executable) {
        executable = executableOverride || executable;
        if (executable === undefined) {
            return Promise.reject(new Error('No executable given to execute in test!'));
        }
        return shell.exec(executable, {cwd: 'temp'});
    };
};

exports.matchOutput = function (matcher) {
    matcher = matcher || /42/;

    return function (output) {
        if (output.stdout.match(matcher)) {
            return Promise.resolve();
        } else {
            return Promise.reject(new Error('STDOUT "' + output.stdout + '" did not match ' + matcher));
        }
    };
};

exports.testConfiguration = function (configuration) {
    return exports.writeConfiguration(configuration)
    .then(exports.generateWithParameters())
    .then(exports.build())
    .then(exports.runBuiltExecutable())
    .then(exports.matchOutput());
};
