
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

var outputNameFromSourceFile = function (sourceFile) {
    var matchedName = sourceFile.match(/([^\/]+)\.\w+$/);
    if (matchedName === null) {
        throw new Error('given_source_file_without_extension');
    }
    return matchedName[1];
};

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
        compilerCommand: 'clang -c ',
        staticLibraryCommand: 'ar rcs ',
        executableCommand: 'clang -o ',
        outputNameFlag: '-o ',
        includePathFlag: '-I',
        staticLibraryPrefix: 'lib',
        staticLibrarySuffix: '.a',
        objectFileSuffix: '.c.o',
        libraryLinkFlag: ' -L./ -l'
    },
    gcc: {
        hosts: [
            'linux',
            'linux-gcc'
        ],
        compilerCommand: 'gcc -c ',
        staticLibraryCommand: 'ar rcs ',
        executableCommand: 'gcc -o ',
        outputNameFlag: '-o ',
        includePathFlag: '-I',
        staticLibraryPrefix: 'lib',
        staticLibrarySuffix: '.a',
        objectFileSuffix: '.c.o',
        libraryLinkFlag: ' -L./ -l'
    },
    cl: {
        hosts: [
            'win32',
            'win32-cl'
        ]
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

var processPath = function (compiler, path) {
    if (compiler === 'cl') {
        return path.replace(/\//g, '\\');
    } else {
        return path;
    }
};

var joinPaths = function (compiler, paths, prefix) {
    prefix = prefix || '';
    var joinedPaths = prefix;
    paths.forEach(function (path, i) {
        if (i != 0) {
            joinedPaths += " " + prefix;
        }
        joinedPaths += processPath(compiler, path);
    });
    return joinedPaths;
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

var ClCompilerGenerator = require('./cl-compiler-generator');

var generateCompileInstructionsForCl = function (outputName, config) {
    var instructions = [];
    var objectFiles = [];
    config.files.forEach(function (file) {
        var match = file.match(/([^\.]+)\.\w+$/);
        if (match) {
            instructions.push(ClCompilerGenerator.compilerCommand({
                file: file,
                includePaths: config.includePaths
            }));
            objectFiles.push(match[1] + '.obj');
        }
    });
    
    instructions.push(ClCompilerGenerator.linkerCommand({
        objectFiles: objectFiles,
        outputName: outputName,
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
    var compilerCommand = compilerInfo.compilerCommand;
    var staticLibraryCommand = compilerInfo.staticLibraryCommand;
    var executableCommand = compilerInfo.executableCommand;
    var outputNameFlag = compilerInfo.outputNameFlag;
    var includePathFlag = compilerInfo.includePathFlag;
    var staticLibraryPrefix = compilerInfo.staticLibraryPrefix;
    var staticLibrarySuffix = compilerInfo.staticLibrarySuffix;
    var libraryLinkFlag = compilerInfo.libraryLinkFlag;

    if (config.files === undefined || config.files.length === 0) {
        throw new Error('no_source_files');
    }

    var sourceFiles = joinPaths(compiler, config.files);
    var outputName = config.outputName || outputNameFromSourceFile(config.files[0]);

    if (compiler === 'cl') {
        return generateCompileInstructionsForCl(outputName, config);
    }

    var compilerFlags = '',
        linkerFlags = '';
    if (config.includePaths) {
        compilerFlags += " " + joinPaths(compiler, config.includePaths, includePathFlag);
    }
    if (standardLinkerFlags[config.host]) {
        linkerFlags += ' ' + standardLinkerFlags[config.host];
    }
    if (config.compilerFlags) {
        compilerFlags += ' ' + config.compilerFlags;
    }
    if (config.libraries) {
        linkerFlags += libraryLinkFlag + config.libraries.join(libraryLinkFlag);
    }

    var linkerCommand;
    if (config.type === 'static-library') {
        outputName = staticLibraryPrefix + outputName + staticLibrarySuffix;
        linkerCommand = staticLibraryCommand;
    } else {
        linkerCommand = executableCommand;
    }

    var instructions = [];
    var objectFiles = [];
    config.files.forEach(function (file) {
        var filename = file.match(/([^\/]+)\.c$/);
        if (filename) {
            var objectFileName = filename[1] + compilerInfo.objectFileSuffix;
            instructions.push(compilerCommand + processPath(compiler, file) + compilerFlags + ' ' + outputNameFlag + objectFileName);
            objectFiles.push(objectFileName);
        }
    });
    instructions.push(linkerCommand + outputName + linkerFlags + ' ' + objectFiles.join(' '));
    return instructions;
};

exports.generate = function (config) {
    validateConfig(config);
    
    var makefile =
        'all:' +
        '\n\t' + generateCompileInstructions(config).join('\n\t') + '\n';

    return makefile;
};
