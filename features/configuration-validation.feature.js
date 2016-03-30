
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

describe('Configuration Validation', function () {
    beforeEach(function () {
        return util.beforeEach();
    });

    afterEach(function () {
        return util.afterEach();
    });

    it('should compile given a minimal config', function () {
        return util.buildSimple({
            type: 'application',
            host: 'linux',
            files: ['simple.c'],
            outputName: 'app'
        });
    });

    var configShouldFailWith = function (config, expectedError, property) {
        return util.buildSimple(config).then(function () {
            return Promise.reject(new Error('Did not fail'));
        }, function (error) {
            return Promise.all([
                error.stdout.should.match(expectedError),
                error.stdout.should.match(property)
            ]);
        });
    };

    it('should give error "unknown property" with property "x" given an unknown property x', function () {
        return configShouldFailWith({
            type: 'application',
            host: 'linux',
            files: ['simple.c'],
            outputName: 'app',
            unknownProperty: ''
        }, /unknown property/i, /unknownProperty/);
    });

    it('should give error "given libraries with static-library" with property "libraries" if given libraries to link while type is "static-library"', function () {
        return configShouldFailWith({
            type: 'static-library',
            host: 'linux',
            files: ['simple.c'],
            outputName: 'app',
            libraries: ['another_library']
        }, /given libraries with static-library/i, /libraries/);
    });

    describe('Missing required properties', function () {
        it('should give error "missing required property" with property "type" when missing type', function () {
            return configShouldFailWith({
                host: 'linux',
                files: ['simple.c'],
                outputName: 'app'
            }, /missing required property/i, /type/);
        });

        it('should give error "missing required property" with property "host" when missing type', function () {
            return configShouldFailWith({
                type: 'application',
                files: ['simple.c'],
                outputName: 'app'
            }, /missing required property/i, /host/);
        });

        it('should give error "missing required property" with property "files" when missing type', function () {
            return configShouldFailWith({
                type: 'application',
                host: 'linux',
                outputName: 'app'
            }, /missing required property/i, /files/);
        });

        it('should give error "missing required property" with property "outputName" when missing type', function () {
            return configShouldFailWith({
                type: 'application',
                host: 'linux',
                files: ['simple.c']
            }, /missing required property/i, /outputName/);
        });

        it('should give error "no input files" with property "files" when there are no input files', function () {
            return configShouldFailWith({
                type: 'application',
                host: 'linux',
                files: [],
                outputName: 'app'
            }, /no input files/i, /files/);
        });
    });

    describe('Invalid properties', function () {
        it('should give error "invalid property" with property "type" when type has an invalid value', function () {
            return configShouldFailWith({
                type: 'invalid-type',
                host: 'linux',
                files: ['simple.c'],
                outputName: 'app'
            }, /invalid property/i, /type/);
        });

        it('should give error "invalid property" with property "host" when host has an invalid value', function () {
            return configShouldFailWith({
                type: 'application',
                host: 'invalid-host',
                files: ['simple.c'],
                outputName: 'app'
            }, /invalid property/i, /host/);
        });

        it('should give error "property is not a string" with property "outputName" when outputName is not a string', function () {
            return configShouldFailWith({
                type: 'application',
                host: 'linux',
                files: ['simple.c'],
                outputName: 1
            }, /property is not a string/i, /outputName/);
        });

        it('should give error "property is not a string" with property "outputPath" when outputPath is not a string', function () {
            return configShouldFailWith({
                type: 'application',
                host: 'linux',
                files: ['simple.c'],
                outputName: 'app',
                outputPath: 1
            }, /property is not a string/i, /outputPath/);
        });

        it('should give error "property is not a string" with property "compilerFlags" when compilerFlags is not a string', function () {
            return configShouldFailWith({
                type: 'application',
                host: 'linux',
                files: ['simple.c'],
                outputName: 'app',
                compilerFlags: 1
            }, /property is not a string/i, /compilerFlags/);
        });

        it('should give error "property is not a string" with property "linkerFlags" when linkerFlags is not a string', function () {
            return configShouldFailWith({
                type: 'application',
                host: 'linux',
                files: ['simple.c'],
                outputName: 'app',
                linkerFlags: 1
            }, /property is not a string/i, /linkerFlags/);
        });

        it('should give error "property is not a string array" with property "files" when files is not a string', function () {
            return configShouldFailWith({
                type: 'application',
                host: 'linux',
                files: [1],
                outputName: 'app'
            }, /property is not a string array/i, /files/);
        });

        it('should give error "property is not a string array" with property "includePaths" when includePaths is not a string', function () {
            return configShouldFailWith({
                type: 'application',
                host: 'linux',
                files: ['simple.c'],
                outputName: 'app',
                includePaths: [1]
            }, /property is not a string array/i, /includePaths/);
        });

        it('should give error "property is not a string array" with property "libraries" when libraries is not a string', function () {
            return configShouldFailWith({
                type: 'application',
                host: 'linux',
                files: ['simple.c'],
                outputName: 'app',
                libraries: [1]
            }, /property is not a string array/i, /libraries/);
        });
    });

    describe('File extensions', function () {
        it('should give error "no extension" with property "files" when a file in files has no extension', function () {
            return Promise.resolve().then(function () {
                return configShouldFailWith({
                    type: 'application',
                    host: 'linux',
                    files: ['other-file'],
                    outputName: 'app'
                }, /no extension/i, /files/);
            }).then(function () {
                return configShouldFailWith({
                    type: 'application',
                    host: 'linux',
                    files: ['main.c', 'other-file'],
                    outputName: 'app'
                }, /no extension/i, /files/);
            }).then(function () {
                return configShouldFailWith({
                    type: 'application',
                    host: 'linux',
                    files: ['main.'],
                    outputName: 'app'
                }, /no extension/i, /files/);
            });
        });

        it('should give error "cannot be path" with property "outputName" given a path in outputName', function () {
            var invalidOutputName = function (outputName) {
                return configShouldFailWith({
                    type: 'application',
                    host: 'linux',
                    files: ['simple.c'],
                    outputName: outputName
                }, /cannot be path/i, /outputName/);
            };

            return Promise.resolve().then(function () {
                return invalidOutputName('app/');
            }).then(function () {
                return invalidOutputName('/app');
            }).then(function () {
                return invalidOutputName('/');
            }).then(function () {
                return invalidOutputName('.');
            }).then(function () {
                return invalidOutputName('..');
            });
        });
    });
});
