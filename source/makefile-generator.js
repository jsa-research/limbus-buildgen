
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014-2016 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

var _ = require('./publicdash');
var makefileBuilder = require('./makefile-builder');
var gccLikeCompilerGenerator = require('./gcc-like-compiler-generator');
var clCompilerGenerator = require('./cl-compiler-generator');

var compilerInfoTable = {
    clang: {
        hosts: [
            'darwin',
            'darwin-clang',
            'linux-clang',
            'freebsd',
            'freebsd-clang'
        ],
        compilerCommand: function (options) { return gccLikeCompilerGenerator.compilerCommand('clang', options); },
        linkerCommand: function (options) { return gccLikeCompilerGenerator.linkerCommand('clang', options); },
        objectFileSuffix: '.c.o'
    },
    gcc: {
        hosts: [
            'linux',
            'linux-gcc',
            'darwin-gcc',
            'freebsd-gcc'
        ],
        compilerCommand: function (options) { return gccLikeCompilerGenerator.compilerCommand('gcc', options); },
        linkerCommand: function (options) { return gccLikeCompilerGenerator.linkerCommand('gcc', options); },
        objectFileSuffix: '.c.o'
    },
    cl: {
        hosts: [
            'win32',
            'win32-cl'
        ],
        compilerCommand: clCompilerGenerator.compilerCommand,
        linkerCommand: clCompilerGenerator.linkerCommand,
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

var operatingSystemByHost = function (host) {
    return host.match(/^\w+/)[0];
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

var generateCompileInstructionsForCompiler = function (compilerInfo, os, outputName, config) {
    var filenames = _.filter(_.map(config.files, parseFileName), _.not.isNull);
    var instructions = _.map(filenames, function (filename) {
        return compilerInfo.compilerCommand({
            type: config.type,
            file: filename.full,
            includePaths: config.includePaths,
            flags: config.compilerFlags
        });
    });
    var objectFiles = _.map(filenames, function (filename) {
        return filename.name + compilerInfo.objectFileSuffix;
    });

    var additionalLinkerFlags = '';
    if (config.type === 'application') {
        if (os === 'linux' || os === 'freebsd') {
            additionalLinkerFlags = ' -Wl,-rpath=.';
        }
    }

    instructions.push(compilerInfo.linkerCommand({
        objectFiles: objectFiles,
        outputName: outputName,
        outputPath: config.outputPath,
        libraryPaths: config.libraryPaths,
        flags: (config.linkerFlags || '') + additionalLinkerFlags,
        libraries: config.libraries,
        type: config.type
    }));
    return instructions;
};

var generateCompileInstructions = function (config) {
    var compiler = compilerByHost(config.host);
    var os = operatingSystemByHost(config.host);
    var compilerInfo = compilerInfoTable[compiler];

    if (config.type !== 'static-library' && (config.host.indexOf('linux') !== -1 || config.host.indexOf('freebsd') !== -1)) {
        config.libraries = config.libraries || [];
        config.libraries.push('m');
    }

    return generateCompileInstructionsForCompiler(compilerInfo, os, config.outputName, config);
};

exports.generate = function (config) {
    return makefileBuilder.build({
        all: generateCompileInstructions(config)
    });
};
