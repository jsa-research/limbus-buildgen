
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

var _ = require('./publicdash');
var typeCheck = require('./type-check');
var makefileBuilder = require('./makefile-builder');
var ConfigValidator = require('./config-validator');

var compilerInfoTable = {
    clang: {
        hosts: [
            'darwin',
            'darwin-clang',
            'linux-clang',
            'freebsd',
            'freebsd-clang'
        ],
        generator: require('./clang-compiler-generator'),
        objectFileSuffix: '.c.o'
    },
    gcc: {
        hosts: [
            'linux',
            'linux-gcc',
            'darwin-gcc',
            'freebsd-gcc'
        ],
        generator: require('./gcc-compiler-generator'),
        objectFileSuffix: '.c.o'
    },
    cl: {
        hosts: [
            'win32',
            'win32-cl'
        ],
        generator: require('./cl-compiler-generator'),
        objectFileSuffix: '.obj'
    }
};

exports.supportedHosts = [];
(function () {
    for (var compiler in compilerInfoTable) {
        compilerInfoTable[compiler].hosts.forEach(function (host) {
            exports.supportedHosts.push(host);
        });
    }
})();

var compilerByHost = function (host) {
    if (host !== undefined) {
        var compilerFound;
        for (var compiler in compilerInfoTable) {
            compilerInfoTable[compiler].hosts.forEach(function (hostInList) {
                if (hostInList === host) {
                    compilerFound = compiler;
                }
            });
        }
        return compilerFound;

    } else {
        return 'gcc';
    }
};

var parseFileName = function (fileName) {
    var match = fileName.match(/^(.+)\.(\w+)$/);
    if (match) {
        return {
            full: match[0],
            name: match[1],
            suffix: match[2]
        };
    } else {
        return null;
    }
};

var generateCompileInstructionsForCompiler = function (compiler, outputName, config) {
    var filenames = _.filter(_.map(config.files, parseFileName), _.not.isNull);
    var instructions = _.map(filenames, function (filename) {
        return compiler.generator.compilerCommand({
            type: config.type,
            file: filename.full,
            includePaths: config.includePaths,
            flags: config.compilerFlags
        });
    });
    var objectFiles = _.map(filenames, function (filename) {
        return filename.name + compiler.objectFileSuffix;
    });

    instructions.push(compiler.generator.linkerCommand({
        objectFiles: objectFiles,
        outputName: outputName,
        outputPath: config.outputPath,
        flags: config.linkerFlags,
        libraries: config.libraries,
        type: config.type
    }));
    return instructions;
};

var generateCompileInstructions = function (config) {
    var compiler = compilerByHost(config.host);
    var compilerInfo = compilerInfoTable[compiler];

    if (config.type !== 'static-library' && (config.host.indexOf('linux') !== -1 || config.host.indexOf('freebsd') !== -1)) {
        config.libraries = config.libraries || [];
        config.libraries.push('m');
    }

    return generateCompileInstructionsForCompiler(compilerInfo, config.outputName, config);
};

exports.generate = function (config) {
    var validationResult = ConfigValidator.validate(config);

    if (validationResult.valid === false) {
        throw new Error(validationResult.error + ': ' + validationResult.property);
    }

    return makefileBuilder.build({
        all: generateCompileInstructions(config)
    });
};
