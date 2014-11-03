
// sea-strap.js - A "build anywhere" C/C++ makefile/project generator.
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

var standardFlags = {
    freebsd: '-lm',
    linux: '-lm'
};

var compilerInfoTable = {
    clang: {
        hosts: [
            'darwin',
            'darwin-clang',
            'linux-clang',
            'freebsd'
        ],
        outputNameFlag: '-o ',
        includePathFlag: '-I'
    },
    gcc: {
        hosts: [
            'linux',
            'linux-gcc'
        ],
        outputNameFlag: '-o ',
        includePathFlag: '-I'
    },
    cl: {
        hosts: [
            'win32-cl'
        ],
        outputNameFlag: '/Fe',
        includePathFlag: '/I'
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

exports.generate = function (config) {
    var compiler = compilerByHost(config.host);
    if (config.host !== undefined && !isHostValid(config.host)) {
        throw new Error('invalid_host');
    }
    
    var compilerInfo = compilerInfoTable[compiler];
    var outputNameFlag = compilerInfo.outputNameFlag;
    var includePathFlag = compilerInfo.includePathFlag;

    if (config.files === undefined || config.files.length === 0) {
        throw new Error('no_source_files');
    }

    var sourceFiles = joinPaths(compiler, config.files);
    var outputName = config.outputName || outputNameFromSourceFile(config.files[0]);

    var extraFlags = '';
    if (config.includePaths) {
        extraFlags += " " + joinPaths(compiler, config.includePaths, includePathFlag);
    }
    if (standardFlags[config.host]) {
        extraFlags += ' ' + standardFlags[config.host];
    }

    var makefile =
        'all:\n' + 
        '\t' + compiler + ' ' + sourceFiles + extraFlags + ' ' + outputNameFlag + outputName + '\n';

    return makefile;
};
