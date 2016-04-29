
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
var minimal = require('../source/minimal-configuration');

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
        return util.testConfiguration(minimal.projectWithArtifactWith({
            files: [
                'linked.c',
                'source/mylibrary.c'
            ],
            includePaths: [
                'include'
            ]
        }));
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
            return util.writeConfiguration(minimal.projectWithArtifactWith({
                type: type,
                linkerFlags: failFlags[type][util.hostCompiler]
            }))
            .then(util.generateWithParameters())
            .then(util.build()).should.be.rejected();
        };
        var linkerFlagsShouldSucceedForType = function(type, flags) {
            return util.writeConfiguration(minimal.projectWithArtifactWith({
                type: type,
                linkerFlags: succeedFlags[type][util.hostCompiler]
            }))
            .then(util.generateWithParameters())
            .then(util.build());
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
        return util.testConfiguration(minimal.projectWithArtifactWith({
            files: [
                'math.c'
            ]
        }));
    });

    it('should compile to an executable with outputName', function () {
        return util.writeConfiguration(minimal.projectWithArtifactWith({
            outputName: 'my_executable'
        }))
        .then(util.generateWithParameters())
        .then(util.build())
        .then(util.runBuiltExecutable(shell.path('./my_executable')))
        .then(util.matchOutput());
    });

    it('should compile a static library and then be able to link to it', function () {
        return util.testConfiguration({
            title: 'project',
            artifacts: [
                {
                    title: 'library',
                    type: 'static-library',
                    host: util.host,
                    files: [
                        'source/mylibrary.c'
                    ],
                    outputName: 'my_lib_name'
                },
                {
                    title: 'app',
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
                    outputName: 'app'
                }
            ]
        });
    });

    it('should compile a dynamic library and then be able to link to it', function () {
        return util.testConfiguration({
            title: 'project',
            artifacts: [
                {
                    title: 'static library',
                    type: 'static-library',
                    host: util.host,
                    files: [
                        'source/mylibrary.c'
                    ],
                    outputName: 'my_lib_name'
                },
                {
                    title: 'dynamic library',
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
                    title: 'app',
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
                    outputName: 'app'
                }
            ]
        });
    });

    it('should search libraryPaths to find libraries to link', function () {
        return util.testConfiguration({
            title: 'project',
            artifacts: [
                {
                    title: 'library',
                    type: 'static-library',
                    host: util.host,
                    files: [
                        'source/mylibrary.c'
                    ],
                    outputName: 'my_lib_name',
                    outputPath: 'source'
                },
                {
                    title: 'app',
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
                    outputName: 'app'
                }
            ]
        });
    });
});
