
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

    it('should compile given a minimal artifact configuration', function () {
        return util.buildSimple(util.minimalArtifactWith({
            files: ['simple.c']
        }));
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
        return configShouldFailWith(util.minimalArtifactWith({
            unknownProperty: ''
        }), /unknown property/i, /unknownProperty/);
    });

    it('should give error "given libraries with static-library" with property "libraries" if given libraries to link while type is "static-library"', function () {
        return configShouldFailWith(util.minimalArtifactWith({
            type: 'static-library',
            libraries: ['another_library']
        }), /given libraries with static-library/i, /libraries/);
    });

    describe('Missing required properties', function () {
        it('should give error "missing required property" with property "title" when missing title', function () {
            return configShouldFailWith(util.minimalArtifactWith({
                title: undefined
            }), /missing required property/i, /title/);
        });

        it('should give error "missing required property" with property "type" when missing type', function () {
            return configShouldFailWith(util.minimalArtifactWith({
                type: undefined
            }), /missing required property/i, /type/);
        });

        it('should give error "missing required property" with property "host" when missing type', function () {
            return configShouldFailWith(util.minimalArtifactWith({
                host: undefined
            }), /missing required property/i, /host/);
        });

        it('should give error "missing required property" with property "files" when missing type', function () {
            return configShouldFailWith(util.minimalArtifactWith({
                files: undefined
            }), /missing required property/i, /files/);
        });

        it('should give error "missing required property" with property "outputName" when missing type', function () {
            return configShouldFailWith(util.minimalArtifactWith({
                outputName: undefined
            }), /missing required property/i, /outputName/);
        });

        it('should give error "no input files" with property "files" when there are no input files', function () {
            return configShouldFailWith(util.minimalArtifactWith({
                files: []
            }), /no input files/i, /files/);
        });
    });

    describe('Invalid properties', function () {
        it('should give error "invalid property" with property "type" when type has an invalid value', function () {
            return configShouldFailWith(util.minimalArtifactWith({
                type: 'invalid-type'
            }), /invalid property/i, /type/);
        });

        it('should give error "invalid property" with property "host" when host has an invalid value', function () {
            return configShouldFailWith(util.minimalArtifactWith({
                host: 'invalid-host'
            }), /invalid property/i, /host/);
        });

        it('should give error "property is not a string" with property "outputName" when outputName is not a string', function () {
            return configShouldFailWith(util.minimalArtifactWith({
                outputName: 1
            }), /property is not a string/i, /outputName/);
        });

        it('should give error "property is not a string" with property "outputPath" when outputPath is not a string', function () {
            return configShouldFailWith(util.minimalArtifactWith({
                outputPath: 1
            }), /property is not a string/i, /outputPath/);
        });

        it('should give error "property is not a string" with property "compilerFlags" when compilerFlags is not a string', function () {
            return configShouldFailWith(util.minimalArtifactWith({
                compilerFlags: 1
            }), /property is not a string/i, /compilerFlags/);
        });

        it('should give error "property is not a string" with property "linkerFlags" when linkerFlags is not a string', function () {
            return configShouldFailWith(util.minimalArtifactWith({
                linkerFlags: 1
            }), /property is not a string/i, /linkerFlags/);
        });

        it('should give error "property is not a string array" with property "files" when files is not a string', function () {
            return configShouldFailWith(util.minimalArtifactWith({
                files: [1]
            }), /property is not a string array/i, /files/);
        });

        it('should give error "property is not a string array" with property "includePaths" when includePaths is not a string', function () {
            return configShouldFailWith(util.minimalArtifactWith({
                includePaths: [1]
            }), /property is not a string array/i, /includePaths/);
        });

        it('should give error "property is not a string array" with property "libraryPaths" when libraryPaths is not a string', function () {
            return configShouldFailWith(util.minimalArtifactWith({
                libraryPaths: [1]
            }), /property is not a string array/i, /libraryPaths/);
        });

        it('should give error "property is not a string array" with property "libraries" when libraries is not a string', function () {
            return configShouldFailWith(util.minimalArtifactWith({
                libraries: [1]
            }), /property is not a string array/i, /libraries/);
        });
    });

    describe('File extensions', function () {
        it('should give error "no extension" with property "files" when a file in files has no extension', function () {
            return Promise.resolve().then(function () {
                return configShouldFailWith(util.minimalArtifactWith({
                    files: ['other-file']
                }), /no extension/i, /files/);
            }).then(function () {
                return configShouldFailWith(util.minimalArtifactWith({
                    files: ['main.c', 'other-file']
                }), /no extension/i, /files/);
            }).then(function () {
                return configShouldFailWith(util.minimalArtifactWith({
                    files: ['main.']
                }), /no extension/i, /files/);
            });
        });

        it('should give error "cannot be path" with property "outputName" given a path in outputName', function () {
            var invalidOutputName = function (outputName) {
                return configShouldFailWith(util.minimalArtifactWith({
                    outputName: outputName
                }), /cannot be path/i, /outputName/);
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
