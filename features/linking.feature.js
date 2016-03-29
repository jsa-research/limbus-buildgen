
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

var should = require('should');
var fs = require('fs');
var util = require('./util.js');

var setup = function () {
    util.copyFiles([
        'linked.c',
        'linked_dynamic.c',
        'source/mylibrary.c',
        'include/mylibrary.h',
        'source/mydynamiclibrary.c',
        'include/mydynamiclibrary.h',
        'math.c',
        'simple.c'
    ], 'features/linking/', 'temp/');
};

describe('Linking', function () {
    it('should compile and link correctly given several source files and includes', function (done) {
        util.generateCompileAndRun({
            setup: setup,
            config: {
                type: 'application',
                host: process.platform,
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
        }, done);
    });

    it('should link with libm by default', function (done) {
        util.generateCompileAndRun({
            setup: setup,
            config: {
                type: 'application',
                host: process.platform,
                files: [
                    'math.c'
                ],
                outputName: 'math'
            },
            command: 'math',
            expectOutputToMatch: /42/
        }, done);
    });

    it('should compile to an executable with outputName', function (done) {
        util.generateCompileAndRun({
            setup: setup,
            config: {
                type: 'application',
                host: process.platform,
                files: [
                    'simple.c'
                ],
                outputName: 'my_executable'
            },
            command: 'my_executable',
            expectOutputToMatch: /42/
        }, done);
    });

    it('should compile a static library and then be able to link to it', function (done) {
        util.generateCompileAndRun({
            setup: setup,
            config: [
                {
                    type: 'static-library',
                    host: process.platform,
                    files: [
                        'source/mylibrary.c'
                    ],
                    outputName: 'my_lib_name'
                },
                {
                    type: 'application',
                    host: process.platform,
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
        }, done);
    });

    it('should compile a dynamic library and then be able to link to it', function (done) {
        util.generateCompileAndRun({
            setup: setup,
            config: [
                {
                    type: 'static-library',
                    host: process.platform,
                    files: [
                        'source/mylibrary.c'
                    ],
                    outputName: 'my_lib_name'
                },
                {
                    type: 'dynamic-library',
                    host: process.platform,
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
                    host: process.platform,
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
        }, done);
    });
});
