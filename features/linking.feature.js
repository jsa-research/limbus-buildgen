
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014-2016 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

var should = require('should');
var util = require('./util.js');
var shell = require('./shell.js');

describe('Linking', function () {
    beforeEach(function () {
        return util.beforeEach().then(function () {
            return shell.mkdir('temp/include');
        }).then(function () {
            return shell.copyFiles([
                'linked.c',
                'linked_dynamic.c',
                'source/mylibrary.c',
                'include/mylibrary.h',
                'source/mydynamiclibrary.c',
                'include/mydynamiclibrary.h',
                'math.c',
            ], 'features/linking/', 'temp/');
        });
    });

    afterEach(function () {
        return util.afterEach();
    });

    it('should compile and link correctly given several source files and includes', function () {
        return util.generateCompileAndRun({
            config: {
                type: 'application',
                host: util.host,
                files: [
                    'linked.c',
                    'source/mylibrary.c'
                ],
                includePaths: [
                    'include'
                ],
                outputName: 'linked'
            },
            command: 'linked',
            expectOutputToMatch: /42/
        });
    });

    it('should pass linker flags as is', function () {
        var failFlags = {
            'application': {
                'cl': '/link /NODEFAULTLIB',
                'clang': '-nostdlib',
                'gcc': '-nostdlib'
            },
            'static-library': {
                'cl': '/SUBSYSTEM:BOOT_APPLICATIO',
                'clang': 'q',
                'gcc': 'q'
            },
            'dynamic-library': {
                'cl': '/NODEFAULTLIB',
                'clang': '-o',
                'gcc': '-o'
            }
        };
        var succeedFlags = {
            'application': {
                'cl': '/link /VERSION:1.0',
                'clang': '-s',
                'gcc': '-s'
            },
            'static-library': {
                'cl': '/WX:NO',
                'clang': 'v',
                'gcc': 'v'
            },
            'dynamic-library': {
                'cl': '/VERSION:1.0',
                'clang': '-s',
                'gcc': '-s'
            }
        };

        var linkerFlagsShouldFailForType = function(type, flags) {
            return util.buildSimple({
                type: type,
                host: util.host,
                files: ['simple.c'],
                outputName: 'app',
                linkerFlags: failFlags[type][util.hostCompiler]
            }).then(function () {
                return Promise.reject(new Error(type + ' did not fail'));
            }, function () {
                return Promise.resolve();
            });
        };
        var linkerFlagsShouldSucceedForType = function(type, flags) {
            return util.buildSimple({
                type: type,
                host: util.host,
                files: ['simple.c'],
                outputName: 'app',
                linkerFlags: succeedFlags[type][util.hostCompiler]
            });
        };

        return Promise.resolve().then(function () {
            return linkerFlagsShouldSucceedForType('application');
        }).then(function () {
            return linkerFlagsShouldSucceedForType('static-library');
        }).then(function () {
            return linkerFlagsShouldSucceedForType('dynamic-library');
        }).then(function () {
            return linkerFlagsShouldFailForType('application');
        }).then(function () {
            return linkerFlagsShouldFailForType('static-library');
        }).then(function () {
            return linkerFlagsShouldFailForType('dynamic-library');
        });
    });

    it('should link with libm by default', function () {
        return util.generateCompileAndRun({
            config: {
                type: 'application',
                host: util.host,
                files: [
                    'math.c'
                ],
                outputName: 'math'
            },
            command: 'math',
            expectOutputToMatch: /42/
        });
    });

    it('should compile to an executable with outputName', function () {
        return util.generateCompileAndRun({
            config: {
                type: 'application',
                host: util.host,
                files: [
                    'simple.c'
                ],
                outputName: 'my_executable'
            },
            command: 'my_executable',
            expectOutputToMatch: /42/
        });
    });

    it('should compile a static library and then be able to link to it', function () {
        return util.generateCompileAndRun({
            config: [
                {
                    type: 'static-library',
                    host: util.host,
                    files: [
                        'source/mylibrary.c'
                    ],
                    outputName: 'my_lib_name'
                },
                {
                    type: 'application',
                    host: util.host,
                    files: [
                        'linked.c'
                    ],
                    libraries: [
                        'my_lib_name'
                    ],
                    includePaths: [
                        'include'
                    ],
                    outputName: 'linked_with_library'
                }
            ],
            command: 'linked_with_library',
            expectOutputToMatch: /42/
        });
    });

    it('should compile a dynamic library and then be able to link to it', function () {
        return util.generateCompileAndRun({
            config: [
                {
                    type: 'static-library',
                    host: util.host,
                    files: [
                        'source/mylibrary.c'
                    ],
                    outputName: 'my_lib_name'
                },
                {
                    type: 'dynamic-library',
                    host: util.host,
                    files: [
                        'source/mydynamiclibrary.c'
                    ],
                    libraries: [
                        'my_lib_name'
                    ],
                    outputName: 'my_dyn_lib_name'
                },
                {
                    type: 'application',
                    host: util.host,
                    files: [
                        'linked_dynamic.c'
                    ],
                    libraries: [
                        'my_dyn_lib_name'
                    ],
                    includePaths: [
                        'include'
                    ],
                    // On linux systems the shared object won't be looked for in
                    // the current working directory by default. We just add a
                    // flag so that it is.
                    linkerFlags: (process.platform === 'linux') ? '-Wl,-rpath=.' : '',
                    outputName: 'linked_with_library'
                }
            ],
            command: 'linked_with_library',
            expectOutputToMatch: /42/
        });
    });

    it('should search libraryPaths to find libraries to link', function () {
        return util.generateCompileAndRun({
            config: [
                {
                    type: 'static-library',
                    host: util.host,
                    files: [
                        'source/mylibrary.c'
                    ],
                    outputName: 'my_lib_name',
                    outputPath: 'source'
                },
                {
                    type: 'application',
                    host: util.host,
                    files: [
                        'linked.c'
                    ],
                    libraries: [
                        'my_lib_name'
                    ],
                    includePaths: [
                        'include'
                    ],
                    libraryPaths: [
                        'source'
                    ],
                    outputName: 'linked_with_library'
                }
            ],
            command: 'linked_with_library',
            expectOutputToMatch: /42/
        });
    });
});
