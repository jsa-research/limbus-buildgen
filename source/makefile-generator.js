
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

var typeCheck = require('./type-check');

var standardLinkerFlags = {
    freebsd: '-lm',
    linux: '-lm'
};

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
            'linux-gcc'
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

var isHostValid = function (host) {
    for (var compiler in compilerInfoTable) {
        if (compilerInfoTable[compiler].hosts.indexOf(host) != -1) {
            return true;
        }
    }
    
    return false;
};

var validConfigProperties = [
    'files',
    'outputName',
    'compilerFlags',
    'includePaths',
    'host',
    'type',
    'libraries'
];

var validateConfig = function (config) {
    for (var property in config) {
        if (validConfigProperties.indexOf(property) === -1) {
            var error = new Error('unknown_config_property');
            error.unknownProperty = property;
            throw error;
        }
    }
};

var generateCompileInstructionsForCompiler = function (compiler, outputName, config) {
    var instructions = [];
    var objectFiles = [];
    config.files.forEach(function (file) {
        var match = file.match(/([^\.]+)\.\w+$/);
        if (match) {
            instructions.push(compiler.generator.compilerCommand({
                file: file,
                includePaths: config.includePaths,
                flags: config.compilerFlags
            }));
            objectFiles.push(match[1] + compiler.objectFileSuffix);
        }
    });

    instructions.push(compiler.generator.linkerCommand({
        objectFiles: objectFiles,
        outputName: outputName,
        libraries: config.libraries,
        type: config.type
    }));
    return instructions;
};

var generateCompileInstructions = function (config) {
    var compiler = compilerByHost(config.host);
    if (config.host !== undefined && !isHostValid(config.host)) {
        throw new Error('invalid_host');
    }
    var compilerInfo = compilerInfoTable[compiler];
    
    typeCheck.stringArray(config, 'files', 'required');
    typeCheck.string(config, 'outputName', 'required');

    if (config.type !== 'static-library' && (config.host === 'linux' || config.host === 'freebsd')) {
        config.libraries = config.libraries || [];
        config.libraries.push('m');
    }

    return generateCompileInstructionsForCompiler(compilerInfo, config.outputName, config);
};

exports.generate = function (config) {
    validateConfig(config);
    
    var makefile =
        'all:' +
        '\n\t' + generateCompileInstructions(config).join('\n\t') + '\n';

    return makefile;
};
