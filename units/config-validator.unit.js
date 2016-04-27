
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
var ConfigValidator = require('../source/config-validator');

var minimalArtifact = function () {
    return {
        title: 'app',
        type: 'application',
        host: 'linux',
        files: ['main.c'],
        outputName: 'app'
    };
};

var minimalArtifactWith = function (properties) {
    return Object.assign(minimalArtifact(), properties);
};

var minimalProject = function () {
    return {
        title: 'project',
        artifacts: [minimalArtifact()]
    };
};

var minimalProjectWith = function (properties) {
    return Object.assign(minimalProject(), properties);
};

var minimalProjectWithArtifactProperties = function (properties) {
    return minimalProjectWith({
        artifacts: [minimalArtifactWith(properties)]
    });
}

describe('config-validator', function () {
    describe('validate', function () {
        it('should return {valid: true} given a minimal config', function () {
            var result = ConfigValidator.validate(minimalProject());
            result.valid.should.be.true();
        });

        it('should return {valid: false, error: "unknown property", property: "x"} given an unknown property x', function () {
            var result = ConfigValidator.validate(minimalProjectWithArtifactProperties({
                unknownProperty: ''
            }));
            result.valid.should.be.false();
            result.error.should.equal('unknown property');
            result.property.should.equal('unknownProperty');
        });

        it('should return {valid: false, error: "unknown project property", property: "x"} given an unknown project property x', function () {
            var result = ConfigValidator.validate(minimalProjectWith({
                unknownProperty: ''
            }));
            result.valid.should.be.false();
            result.error.should.equal('unknown project property');
            result.property.should.equal('unknownProperty');
        });

        it('should return {valid: false, error: "given libraries with static-library", property: "libraries"} if given libraries to link while type is "static-library"', function () {
            var result = ConfigValidator.validate(minimalProjectWithArtifactProperties({
                type: 'static-library',
                libraries: ['another_library']
            }));
            result.valid.should.be.false();
            result.error.should.equal('given libraries with static-library');
            result.property.should.equal('libraries');
        });

        describe('Missing required properties', function () {
            it('should return {valid: false, error: "missing required project property", property: "title"} when missing a title', function () {
                var result = ConfigValidator.validate(minimalProjectWith({
                    title: undefined
                }));
                result.valid.should.be.false();
                result.error.should.equal('missing required project property');
                result.property.should.equal('title');
            });

            it('should return {valid: false, error: "missing required project property", property: "artifacts"} when missing an artifacts list', function () {
                var result = ConfigValidator.validate(minimalProjectWith({
                    artifacts: undefined
                }));
                result.valid.should.be.false();
                result.error.should.equal('missing required project property');
                result.property.should.equal('artifacts');
            });

            it('should return {valid: false, error: "missing required property", property: "title"} when missing a title', function () {
                var result = ConfigValidator.validate(minimalProjectWithArtifactProperties({
                    title: undefined
                }));
                result.valid.should.be.false();
                result.error.should.equal('missing required property');
                result.property.should.equal('title');
            });

            it('should return {valid: false, error: "missing required property", property: "type"} when missing a type', function () {
                var result = ConfigValidator.validate(minimalProjectWithArtifactProperties({
                    type: undefined
                }));
                result.valid.should.be.false();
                result.error.should.equal('missing required property');
                result.property.should.equal('type');
            });

            it('should return {valid: false, error: "missing required property", property: "host"} when missing a host', function () {
                var result = ConfigValidator.validate(minimalProjectWithArtifactProperties({
                    host: undefined
                }));
                result.valid.should.be.false();
                result.error.should.equal('missing required property');
                result.property.should.equal('host');
            });

            it('should return {valid: false, error: "missing required property", property: "files"} when missing source files', function () {
                var result = ConfigValidator.validate(minimalProjectWithArtifactProperties({
                    files: undefined
                }));
                result.valid.should.be.false();
                result.error.should.equal('missing required property');
                result.property.should.equal('files');
            });

            it('should return {valid: false, error: "missing required property", property: "outputName"} when missing an output name', function () {
                var result = ConfigValidator.validate(minimalProjectWithArtifactProperties({
                    outputName: undefined
                }));
                result.valid.should.be.false();
                result.error.should.equal('missing required property');
                result.property.should.equal('outputName');
            });

            it('should return {valid: false, error: "no input files"} given an empty files array', function () {
                var result = ConfigValidator.validate(minimalProjectWithArtifactProperties({
                    files: []
                }));
                result.valid.should.be.false();
                result.error.should.equal('no input files');
                result.property.should.equal('files');
            });
        });

        describe('Valid type values', function () {
            it('should return {valid: false, error: "invalid property", property: "type"} when type is an invalid value', function () {
                var result = ConfigValidator.validate(minimalProjectWithArtifactProperties({
                    type: 'invalid-type'
                }));
                result.valid.should.be.false();
                result.error.should.equal('invalid property');
                result.property.should.equal('type');
            });

            it('should return {valid: true} when type is a valid value', function () {
                var validateType = function (type) {
                    var result = ConfigValidator.validate(minimalProjectWithArtifactProperties({
                        type: type
                    }));
                    result.valid.should.be.true();
                };

                validateType('application');
                validateType('dynamic-library');
                validateType('static-library');
            });
        });

        describe('Valid host values', function () {
            it('should return {valid: false, error: "invalid property", property: "host"} when host is an invalid value', function () {
                var result = ConfigValidator.validate(minimalProjectWithArtifactProperties({
                    host: 'invalid-host'
                }));
                result.valid.should.be.false();
                result.error.should.equal('invalid property');
                result.property.should.equal('host');
            });

            it('should return {valid: true} when host is a valid value', function () {
                var validateHost = function (host) {
                    var result = ConfigValidator.validate(minimalProjectWithArtifactProperties({
                        host: host
                    }));
                    result.valid.should.be.true();
                };

                validateHost('linux');
                validateHost('linux-clang');
                validateHost('linux-gcc');
                validateHost('darwin');
                validateHost('darwin-clang');
                validateHost('darwin-gcc');
                validateHost('win32');
                validateHost('win32-cl');
                validateHost('freebsd');
                validateHost('freebsd-clang');
                validateHost('freebsd-gcc');
            });
        });

        describe('Valid string properties', function () {
            it('should return {valid: false, error: "project property is not a string", property: "title"} when project title is not a string', function () {
                var result = ConfigValidator.validate(minimalProjectWith({
                    title: 1
                }));
                result.valid.should.be.false();
                result.error.should.equal('project property is not a string');
                result.property.should.equal('title');
            });

            it('should return {valid: false, error: "property is not a string", property: "title"} when title is not a string', function () {
                var result = ConfigValidator.validate(minimalProjectWithArtifactProperties({
                    title: 1
                }));
                result.valid.should.be.false();
                result.error.should.equal('property is not a string');
                result.property.should.equal('title');
            });

            it('should return {valid: false, error: "property is not a string", property: "outputName"} when outputName is not a string', function () {
                var result = ConfigValidator.validate(minimalProjectWithArtifactProperties({
                    outputName: 1
                }));
                result.valid.should.be.false();
                result.error.should.equal('property is not a string');
                result.property.should.equal('outputName');
            });

            it('should return {valid: false, error: "property is not a string", property: "outputPath"} when outputPath is not a string', function () {
                var result = ConfigValidator.validate(minimalProjectWithArtifactProperties({
                    outputPath: 123
                }));
                result.valid.should.be.false();
                result.error.should.equal('property is not a string');
                result.property.should.equal('outputPath');
            });

            it('should return {valid: false, error: "property is not a string", property: "compilerFlags"} when compilerFlags is not a string', function () {
                var result = ConfigValidator.validate(minimalProjectWithArtifactProperties({
                    compilerFlags: 123
                }));
                result.valid.should.be.false();
                result.error.should.equal('property is not a string');
                result.property.should.equal('compilerFlags');
            });

            it('should return {valid: false, error: "property is not a string", property: "linkerFlags"} when linkerFlags is not a string', function () {
                var result = ConfigValidator.validate(minimalProjectWithArtifactProperties({
                    linkerFlags: 123
                }));
                result.valid.should.be.false();
                result.error.should.equal('property is not a string');
                result.property.should.equal('linkerFlags');
            });
        });

        describe('Valid string array properties', function () {
            it('should return {valid: false, error: "property is not a string array", property: "files"} if files is not a string array', function () {
                var result = ConfigValidator.validate(minimalProjectWithArtifactProperties({
                    files: ['main.c', 3]
                }));
                result.valid.should.be.false();
                result.error.should.equal('property is not a string array');
                result.property.should.equal('files');
            });

            it('should return {valid: false, error: "property is not a string array", property: "includePaths"} if includePaths is not a string array', function () {
                var result = ConfigValidator.validate(minimalProjectWithArtifactProperties({
                    includePaths: [3]
                }));
                result.valid.should.be.false();
                result.error.should.equal('property is not a string array');
                result.property.should.equal('includePaths');
            });

            it('should return {valid: false, error: "property is not a string array", property: "libraryPaths"} if libraryPaths is not a string array', function () {
                var result = ConfigValidator.validate(minimalProjectWithArtifactProperties({
                    libraryPaths: [3]
                }));
                result.valid.should.be.false();
                result.error.should.equal('property is not a string array');
                result.property.should.equal('libraryPaths');
            });

            it('should return {valid: false, error: "property is not a string array", property: "libraries"} if libraries is not a string array', function () {
                var result = ConfigValidator.validate(minimalProjectWithArtifactProperties({
                    libraries: [3]
                }));
                result.valid.should.be.false();
                result.error.should.equal('property is not a string array');
                result.property.should.equal('libraries');
            });
        });

        describe('File extensions', function () {
            it('should return {valid: false, error: "no extension", property: "files"} given a file in files with no extension', function () {
                var result = ConfigValidator.validate(minimalProjectWithArtifactProperties({
                    files: ['other-file']
                }));
                result.valid.should.be.false();
                result.error.should.equal('no extension');
                result.property.should.equal('files');

                result = ConfigValidator.validate(minimalProjectWithArtifactProperties({
                    files: ['main.c', 'other-file']
                }));
                result.valid.should.be.false();
                result.error.should.equal('no extension');
                result.property.should.equal('files');

                result = ConfigValidator.validate(minimalProjectWithArtifactProperties({
                    files: ['main.c', 'file']
                }));
                result.valid.should.be.false();
                result.error.should.equal('no extension');
                result.property.should.equal('files');

                result = ConfigValidator.validate(minimalProjectWithArtifactProperties({
                    files: ['file.']
                }));
                result.valid.should.be.false();
                result.error.should.equal('no extension');
                result.property.should.equal('files');

                result = ConfigValidator.validate(minimalProjectWithArtifactProperties({
                    files: ['file.1']
                }));
                result.valid.should.be.true();
            });
        });

        describe('Filenames are not paths', function () {
            it('should return {valid: false, error: "cannot be path", property: "outputName"} given a path in outputName', function () {
                var invalidOutputName = function (outputName) {
                    var result = ConfigValidator.validate(minimalProjectWithArtifactProperties({
                        outputName: outputName
                    }));
                    result.valid.should.be.false();
                    result.error.should.equal('cannot be path');
                    result.property.should.equal('outputName');
                };

                invalidOutputName('app/');
                invalidOutputName('/app');
                invalidOutputName('\\');
                invalidOutputName('.');
                invalidOutputName('..');
            });
        });
    });
});
