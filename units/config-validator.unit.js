
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
var ConfigValidator = require('../source/config-validator');
var minimal = require('../source/minimal-configuration');

describe('config-validator', function () {
    describe('validate', function () {
        it('should return {valid: true} given a minimal config', function () {
            var result = ConfigValidator.validate(minimal.project());
            result.valid.should.be.true();
        });

        it('should return {valid: false, error: "unknown property", property: "x"} given an unknown property x', function () {
            var result = ConfigValidator.validate(minimal.projectWithArtifactWith({
                unknownProperty: ''
            }));
            result.valid.should.be.false();
            result.error.should.equal('unknown property');
            result.property.should.equal('unknownProperty');
        });

        it('should return {valid: false, error: "unknown project property", property: "x"} given an unknown project property x', function () {
            var result = ConfigValidator.validate(minimal.projectWith({
                unknownProperty: ''
            }));
            result.valid.should.be.false();
            result.error.should.equal('unknown project property');
            result.property.should.equal('unknownProperty');
        });

        it('should return {valid: false, error: "given libraries with static-library", property: "libraries"} if given libraries to link while type is "static-library"', function () {
            var result = ConfigValidator.validate(minimal.projectWithArtifactWith({
                type: 'static-library',
                libraries: ['another_library']
            }));
            result.valid.should.be.false();
            result.error.should.equal('given libraries with static-library');
            result.property.should.equal('libraries');
        });

        describe('Missing required properties', function () {
            it('should return {valid: false, error: "missing required project property", property: "title"} when missing a title', function () {
                var result = ConfigValidator.validate(minimal.projectWith({
                    title: undefined
                }));
                result.valid.should.be.false();
                result.error.should.equal('missing required project property');
                result.property.should.equal('title');
            });

            it('should return {valid: false, error: "missing required project property", property: "artifacts"} when missing an artifacts list', function () {
                var result = ConfigValidator.validate(minimal.projectWith({
                    artifacts: undefined
                }));
                result.valid.should.be.false();
                result.error.should.equal('missing required project property');
                result.property.should.equal('artifacts');
            });

            it('should return {valid: false, error: "missing required property", property: "title"} when missing a title', function () {
                var result = ConfigValidator.validate(minimal.projectWithArtifactWith({
                    title: undefined
                }));
                result.valid.should.be.false();
                result.error.should.equal('missing required property');
                result.property.should.equal('title');
            });

            it('should return {valid: false, error: "missing required property", property: "type"} when missing a type', function () {
                var result = ConfigValidator.validate(minimal.projectWithArtifactWith({
                    type: undefined
                }));
                result.valid.should.be.false();
                result.error.should.equal('missing required property');
                result.property.should.equal('type');
            });

            it('should return {valid: false, error: "missing required property", property: "host"} when missing a host', function () {
                var result = ConfigValidator.validate(minimal.projectWithArtifactWith({
                    host: undefined
                }));
                result.valid.should.be.false();
                result.error.should.equal('missing required property');
                result.property.should.equal('host');
            });

            it('should return {valid: false, error: "missing required property", property: "files"} when missing source files', function () {
                var result = ConfigValidator.validate(minimal.projectWithArtifactWith({
                    files: undefined
                }));
                result.valid.should.be.false();
                result.error.should.equal('missing required property');
                result.property.should.equal('files');
            });

            it('should return {valid: false, error: "missing required property", property: "outputName"} when missing an output name', function () {
                var result = ConfigValidator.validate(minimal.projectWithArtifactWith({
                    outputName: undefined
                }));
                result.valid.should.be.false();
                result.error.should.equal('missing required property');
                result.property.should.equal('outputName');
            });

            it('should return {valid: false, error: "no input files"} given an empty files array', function () {
                var result = ConfigValidator.validate(minimal.projectWithArtifactWith({
                    files: []
                }));
                result.valid.should.be.false();
                result.error.should.equal('no input files');
                result.property.should.equal('files');
            });
        });

        describe('Valid type values', function () {
            it('should return {valid: false, error: "invalid property", property: "type"} when type is an invalid value', function () {
                var result = ConfigValidator.validate(minimal.projectWithArtifactWith({
                    type: 'invalid-type'
                }));
                result.valid.should.be.false();
                result.error.should.equal('invalid property');
                result.property.should.equal('type');
            });

            it('should return {valid: true} when type is a valid value', function () {
                var validateType = function (type) {
                    var result = ConfigValidator.validate(minimal.projectWithArtifactWith({
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
                var result = ConfigValidator.validate(minimal.projectWithArtifactWith({
                    host: 'invalid-host'
                }));
                result.valid.should.be.false();
                result.error.should.equal('invalid property');
                result.property.should.equal('host');
            });

            it('should return {valid: true} when host is a valid value', function () {
                var validateHost = function (host) {
                    var result = ConfigValidator.validate(minimal.projectWithArtifactWith({
                        host: host
                    }));
                    result.valid.should.be.true();
                };

                validateHost('linux');
                validateHost('linux-make-clang-linux-x86');
                validateHost('linux-make-clang-linux-x64');
                validateHost('linux-make-gcc-linux-x86');
                validateHost('linux-make-gcc-linux-x64');
                validateHost('darwin');
                validateHost('darwin-make-clang-darwin-x86');
                validateHost('darwin-make-clang-darwin-x64');
                validateHost('darwin-make-gcc-darwin-x86');
                validateHost('darwin-make-gcc-darwin-x64');
                validateHost('win32');
                validateHost('win32-make-cl-win32-x86');
                validateHost('win32-make-cl-win32-x64');
                validateHost('freebsd');
                validateHost('freebsd-make-clang-freebsd-x86');
                validateHost('freebsd-make-clang-freebsd-x64');
                validateHost('freebsd-make-gcc-freebsd-x64');
            });
        });

        describe('Valid string properties', function () {
            it('should return {valid: false, error: "project property is not a string", property: "title"} when project title is not a string', function () {
                var result = ConfigValidator.validate(minimal.projectWith({
                    title: 1
                }));
                result.valid.should.be.false();
                result.error.should.equal('project property is not a string');
                result.property.should.equal('title');
            });

            it('should return {valid: false, error: "property is not a string", property: "title"} when title is not a string', function () {
                var result = ConfigValidator.validate(minimal.projectWithArtifactWith({
                    title: 1
                }));
                result.valid.should.be.false();
                result.error.should.equal('property is not a string');
                result.property.should.equal('title');
            });

            it('should return {valid: false, error: "property is not a string", property: "outputName"} when outputName is not a string', function () {
                var result = ConfigValidator.validate(minimal.projectWithArtifactWith({
                    outputName: 1
                }));
                result.valid.should.be.false();
                result.error.should.equal('property is not a string');
                result.property.should.equal('outputName');
            });

            it('should return {valid: false, error: "property is not a string", property: "outputPath"} when outputPath is not a string', function () {
                var result = ConfigValidator.validate(minimal.projectWithArtifactWith({
                    outputPath: 123
                }));
                result.valid.should.be.false();
                result.error.should.equal('property is not a string');
                result.property.should.equal('outputPath');
            });

            it('should return {valid: false, error: "property is not a string", property: "compilerFlags"} when compilerFlags is not a string', function () {
                var result = ConfigValidator.validate(minimal.projectWithArtifactWith({
                    compilerFlags: 123
                }));
                result.valid.should.be.false();
                result.error.should.equal('property is not a string');
                result.property.should.equal('compilerFlags');
            });

            it('should return {valid: false, error: "property is not a string", property: "linkerFlags"} when linkerFlags is not a string', function () {
                var result = ConfigValidator.validate(minimal.projectWithArtifactWith({
                    linkerFlags: 123
                }));
                result.valid.should.be.false();
                result.error.should.equal('property is not a string');
                result.property.should.equal('linkerFlags');
            });
        });

        describe('Valid string array properties', function () {
            it('should return {valid: false, error: "property is not a string array", property: "files"} if files is not a string array', function () {
                var result = ConfigValidator.validate(minimal.projectWithArtifactWith({
                    files: ['main.c', 3]
                }));
                result.valid.should.be.false();
                result.error.should.equal('property is not a string array');
                result.property.should.equal('files');
            });

            it('should return {valid: false, error: "property is not a string array", property: "includePaths"} if includePaths is not a string array', function () {
                var result = ConfigValidator.validate(minimal.projectWithArtifactWith({
                    includePaths: [3]
                }));
                result.valid.should.be.false();
                result.error.should.equal('property is not a string array');
                result.property.should.equal('includePaths');
            });

            it('should return {valid: false, error: "property is not a string array", property: "libraryPaths"} if libraryPaths is not a string array', function () {
                var result = ConfigValidator.validate(minimal.projectWithArtifactWith({
                    libraryPaths: [3]
                }));
                result.valid.should.be.false();
                result.error.should.equal('property is not a string array');
                result.property.should.equal('libraryPaths');
            });

            it('should return {valid: false, error: "property is not a string array", property: "libraries"} if libraries is not a string array', function () {
                var result = ConfigValidator.validate(minimal.projectWithArtifactWith({
                    libraries: [3]
                }));
                result.valid.should.be.false();
                result.error.should.equal('property is not a string array');
                result.property.should.equal('libraries');
            });
        });

        describe('File extensions', function () {
            it('should return {valid: false, error: "no extension", property: "files"} given a file in files with no extension', function () {
                var result = ConfigValidator.validate(minimal.projectWithArtifactWith({
                    files: ['other-file']
                }));
                result.valid.should.be.false();
                result.error.should.equal('no extension');
                result.property.should.equal('files');

                result = ConfigValidator.validate(minimal.projectWithArtifactWith({
                    files: ['main.c', 'other-file']
                }));
                result.valid.should.be.false();
                result.error.should.equal('no extension');
                result.property.should.equal('files');

                result = ConfigValidator.validate(minimal.projectWithArtifactWith({
                    files: ['main.c', 'file']
                }));
                result.valid.should.be.false();
                result.error.should.equal('no extension');
                result.property.should.equal('files');

                result = ConfigValidator.validate(minimal.projectWithArtifactWith({
                    files: ['file.']
                }));
                result.valid.should.be.false();
                result.error.should.equal('no extension');
                result.property.should.equal('files');

                result = ConfigValidator.validate(minimal.projectWithArtifactWith({
                    files: ['file.1']
                }));
                result.valid.should.be.true();
            });
        });

        describe('Filenames are not paths', function () {
            it('should return {valid: false, error: "cannot be path", property: "outputName"} given a path in outputName', function () {
                var invalidOutputName = function (outputName) {
                    var result = ConfigValidator.validate(minimal.projectWithArtifactWith({
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
