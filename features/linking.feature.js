
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014-2016 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

require('should');
var util = require('./util.js');
var shell = require('./shell.js');
var minimal = require('../source/minimal-configuration');

describe('Linking', function () {
    beforeEach(function () {
        return util.beforeEach()
        .then(function () {
            return shell.mkdir('temp/include');
        })
        .then(function () {
            return shell.copyFiles([
                'linked.c',
                'linked_dynamic.c',
                'source/mylibrary.c',
                'include/mylibrary.h',
                'source/mydynamiclibrary.c',
                'include/mydynamiclibrary.h',
                'math.c'
            ], 'features/linking/', 'temp/');
        });
    });

    afterEach(function () {
        return util.afterEach();
    });

    it('should compile and link correctly given several source files and includes', function () {
        return util.testConfiguration(minimal.projectWith({
            toolchain: util.toolchain,
            artifacts: [
                minimal.artifactWith({
                    files: [
                        'linked.c',
                        'source/mylibrary.c'
                    ],
                    includePaths: [
                        'include'
                    ]
                })
            ]
        }));
    });

    it('should link with libm by default', function () {
        return util.testConfiguration(minimal.projectWith({
            toolchain: util.toolchain,
            artifacts: [
                minimal.artifactWith({
                    files: [
                        'math.c'
                    ]
                })
            ]
        }));
    });

    it('should compile to an executable with outputName', function () {
        return util.writeConfiguration(minimal.projectWith({
            toolchain: util.toolchain,
            artifacts: [
                minimal.artifactWith({
                    outputName: 'my_executable'
                })
            ]
        }))
        .then(util.generateWithParameters())
        .then(util.build())
        .then(util.runBuiltExecutable(shell.path('./my_executable')))
        .then(util.matchOutput());
    });

    it('should compile a static library and then be able to link to it', function () {
        return util.testConfiguration(minimal.projectWith({
            toolchain: util.toolchain,
            artifacts: [
                minimal.artifactWith({
                    type: 'static-library',
                    files: ['source/mylibrary.c'],
                    outputName: 'my_lib_name'
                }),
                minimal.artifactWith({
                    files: ['linked.c'],
                    libraries: ['my_lib_name'],
                    includePaths: ['include']
                })
            ]
        }));
    });

    it('should pass linker flags as is', function () {
        var linkLibraryForCompiler = {
            gcc: '-Wl,-L. -llibrary',
            clang: '-Wl,-L. -llibrary',
            cl: 'library.lib'
        };

        return util.testConfiguration(minimal.projectWith({
            toolchain: util.toolchain,
            artifacts: [
                minimal.artifactWith({
                    type: 'static-library',
                    files: ['source/mylibrary.c'],
                    outputName: 'library'
                }),
                minimal.artifactWith({
                    files: ['linked.c'],
                    linkerFlags: linkLibraryForCompiler[util.toolchainCompiler],
                    includePaths: ['include']
                })
            ]
        }));
    });

    it('should compile a dynamic library and then be able to link to it', function () {
        return util.testConfiguration(minimal.projectWith({
            toolchain: util.toolchain,
            artifacts: [
                minimal.artifactWith({
                    type: 'static-library',
                    files: ['source/mylibrary.c'],
                    outputName: 'my_lib_name'
                }),
                minimal.artifactWith({
                    type: 'dynamic-library',
                    files: ['source/mydynamiclibrary.c'],
                    libraries: ['my_lib_name'],
                    outputName: 'my_dyn_lib_name'
                }),
                minimal.artifactWith({
                    files: ['linked_dynamic.c'],
                    libraries: ['my_dyn_lib_name'],
                    includePaths: ['include']
                })
            ]
        }));
    });

    it('should search libraryPaths to find libraries to link', function () {
        return util.testConfiguration(minimal.projectWith({
            toolchain: util.toolchain,
            artifacts: [
                minimal.artifactWith({
                    type: 'static-library',
                    files: ['source/mylibrary.c'],
                    outputName: 'my_lib_name',
                    outputPath: 'source'
                }),
                minimal.artifactWith({
                    files: ['linked.c'],
                    libraries: ['my_lib_name'],
                    includePaths: ['include'],
                    libraryPaths: ['source']
                })
            ]
        }));
    });
});
