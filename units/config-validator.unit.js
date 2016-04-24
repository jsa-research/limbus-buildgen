
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

describe('config-validator', function () {
    describe('validate', function () {
        it('should return {valid: true} given a minimal config', function () {
            var result = ConfigValidator.validate({
                type: 'application',
                host: 'linux',
                files: ['main.c'],
                outputName: 'app'
            });
            result.valid.should.be.true();
        });

        it('should return {valid: false, error: "unknown property", property: "x"} given an unknown property x', function () {
            var result = ConfigValidator.validate({
                type: 'application',
                host: 'linux',
                files: ['main.c'],
                outputName: 'app',
                unknownProperty: ''
            });
            result.valid.should.be.false();
            result.error.should.equal('unknown property');
            result.property.should.equal('unknownProperty');

            result = ConfigValidator.validate({
                type: 'application',
                host: 'linux',
                files: ['main.c'],
                outputName: 'app',
                outputPath: ''
            });
            result.valid.should.be.true();
        });

        it('should return {valid: false, error: "given libraries with static-library", property: "libraries"} if given libraries to link while type is "static-library"', function () {
            var result = ConfigValidator.validate({
                type: 'static-library',
                host: 'linux',
                files: ['main.c'],
                outputName: 'static_library',
                libraries: ['another_library']
            });
            result.valid.should.be.false();
            result.error.should.equal('given libraries with static-library');
            result.property.should.equal('libraries');
        });

        describe('Missing required properties', function () {
            it('should return {valid: false, error: "missing required property", property: "type"} when missing a type', function () {
                var result = ConfigValidator.validate({
                    host: 'linux',
                    files: ['main.c'],
                    outputName: 'app'
                });
                result.valid.should.be.false();
                result.error.should.equal('missing required property');
                result.property.should.equal('type');
            });

            it('should return {valid: false, error: "missing required property", property: "host"} when missing a host', function () {
                var result = ConfigValidator.validate({
                    type: 'application',
                    files: ['main.c'],
                    outputName: 'app'
                });
                result.valid.should.be.false();
                result.error.should.equal('missing required property');
                result.property.should.equal('host');
            });

            it('should return {valid: false, error: "missing required property", property: "files"} when missing source files', function () {
                var result = ConfigValidator.validate({
                    type: 'application',
                    host: 'linux',
                    outputName: 'app'
                });
                result.valid.should.be.false();
                result.error.should.equal('missing required property');
                result.property.should.equal('files');
            });

            it('should return {valid: false, error: "missing required property", property: "outputName"} when missing an output name', function () {
                var result = ConfigValidator.validate({
                    type: 'application',
                    host: 'linux',
                    files: ['main.c']
                });
                result.valid.should.be.false();
                result.error.should.equal('missing required property');
                result.property.should.equal('outputName');
            });

            it('should return {valid: false, error: "no input files"} given an empty files array', function () {
                var result = ConfigValidator.validate({
                    type: 'application',
                    host: 'linux',
                    files: [],
                    outputName: 'app'
                });
                result.valid.should.be.false();
                result.error.should.equal('no input files');
                result.property.should.equal('files');
            });
        });

        describe('Valid type values', function () {
            it('should return {valid: false, error: "invalid property", property: "type"} when type is an invalid value', function () {
                var result = ConfigValidator.validate({
                    type: 'invalid-type',
                    host: 'linux',
                    files: ['main.c'],
                    outputName: 'app'
                });
                result.valid.should.be.false();
                result.error.should.equal('invalid property');
                result.property.should.equal('type');

                result = ConfigValidator.validate({
                    type: 'other-invalid-type',
                    host: 'linux',
                    files: ['main.c'],
                    outputName: 'app'
                });
                result.valid.should.be.false();
                result.error.should.equal('invalid property');
                result.property.should.equal('type');
            });

            it('should return {valid: true} when type is a valid value', function () {
                var validateType = function (type) {
                    var result = ConfigValidator.validate({
                        type: type,
                        host: 'linux',
                        files: ['main.c'],
                        outputName: 'app'
                    });
                    result.valid.should.be.true();
                };

                validateType('application');
                validateType('dynamic-library');
                validateType('static-library');
            });
        });

        describe('Valid host values', function () {
            it('should return {valid: false, error: "invalid property", property: "host"} when host is an invalid value', function () {
                var result = ConfigValidator.validate({
                    type: 'application',
                    host: 'invalid-host',
                    files: ['main.c'],
                    outputName: 'app'
                });
                result.valid.should.be.false();
                result.error.should.equal('invalid property');
                result.property.should.equal('host');

                result = ConfigValidator.validate({
                    type: 'application',
                    host: 'other-invalid-host',
                    files: ['main.c'],
                    outputName: 'app'
                });
                result.valid.should.be.false();
                result.error.should.equal('invalid property');
                result.property.should.equal('host');
            });

            it('should return {valid: true} when host is a valid value', function () {
                var validateHost = function (host) {
                    var result = ConfigValidator.validate({
                        type: 'application',
                        host: host,
                        files: ['main.c'],
                        outputName: 'app'
                    });
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
            it('should return {valid: false, error: "property is not a string", property: "outputName"} when outputName is not a string', function () {
                var result = ConfigValidator.validate({
                    type: 'application',
                    host: 'linux',
                    files: ['main.c'],
                    outputName: 1
                });
                result.valid.should.be.false();
                result.error.should.equal('property is not a string');
                result.property.should.equal('outputName');
            });

            it('should return {valid: false, error: "property is not a string", property: "outputPath"} when outputPath is not a string', function () {
                var result = ConfigValidator.validate({
                    type: 'application',
                    host: 'linux',
                    files: ['main.c'],
                    outputName: 'app',
                    outputPath: 123
                });
                result.valid.should.be.false();
                result.error.should.equal('property is not a string');
                result.property.should.equal('outputPath');
            });

            it('should return {valid: false, error: "property is not a string", property: "compilerFlags"} when compilerFlags is not a string', function () {
                var result = ConfigValidator.validate({
                    type: 'application',
                    host: 'linux',
                    files: ['main.c'],
                    outputName: 'app',
                    compilerFlags: 123
                });
                result.valid.should.be.false();
                result.error.should.equal('property is not a string');
                result.property.should.equal('compilerFlags');
            });

            it('should return {valid: false, error: "property is not a string", property: "linkerFlags"} when linkerFlags is not a string', function () {
                var result = ConfigValidator.validate({
                    type: 'application',
                    host: 'linux',
                    files: ['main.c'],
                    outputName: 'app',
                    linkerFlags: 123
                });
                result.valid.should.be.false();
                result.error.should.equal('property is not a string');
                result.property.should.equal('linkerFlags');
            });
        });

        describe('Valid string array properties', function () {
            it('should return {valid: false, error: "property is not a string array", property: "files"} if files is not a string array', function () {
                var result = ConfigValidator.validate({
                    type: 'application',
                    host: 'linux',
                    files: ['main.c', 3],
                    outputName: 'app'
                });
                result.valid.should.be.false();
                result.error.should.equal('property is not a string array');
                result.property.should.equal('files');
            });

            it('should return {valid: false, error: "property is not a string array", property: "includePaths"} if includePaths is not a string array', function () {
                var result = ConfigValidator.validate({
                    type: 'application',
                    host: 'linux',
                    files: ['main.c'],
                    outputName: 'app',
                    includePaths: [3]
                });
                result.valid.should.be.false();
                result.error.should.equal('property is not a string array');
                result.property.should.equal('includePaths');
            });

            it('should return {valid: false, error: "property is not a string array", property: "libraryPaths"} if libraryPaths is not a string array', function () {
                var result = ConfigValidator.validate({
                    type: 'application',
                    host: 'linux',
                    files: ['main.c'],
                    outputName: 'app',
                    libraryPaths: [3]
                });
                result.valid.should.be.false();
                result.error.should.equal('property is not a string array');
                result.property.should.equal('libraryPaths');
            });

            it('should return {valid: false, error: "property is not a string array", property: "libraries"} if libraries is not a string array', function () {
                var result = ConfigValidator.validate({
                    type: 'application',
                    host: 'linux',
                    files: ['main.c'],
                    outputName: 'app',
                    libraries: [3]
                });
                result.valid.should.be.false();
                result.error.should.equal('property is not a string array');
                result.property.should.equal('libraries');
            });
        });

        describe('File extensions', function () {
            it('should return {valid: false, error: "no extension", property: "files"} given a file in files with no extension', function () {
                var result = ConfigValidator.validate({
                    type: 'application',
                    host: 'linux',
                    files: ['other-file'],
                    outputName: 'app',
                });
                result.valid.should.be.false();
                result.error.should.equal('no extension');
                result.property.should.equal('files');

                result = ConfigValidator.validate({
                    type: 'application',
                    host: 'linux',
                    files: ['main.c', 'other-file'],
                    outputName: 'app',
                });
                result.valid.should.be.false();
                result.error.should.equal('no extension');
                result.property.should.equal('files');

                result = ConfigValidator.validate({
                    type: 'application',
                    host: 'linux',
                    files: ['main.c', 'file'],
                    outputName: 'app',
                });
                result.valid.should.be.false();
                result.error.should.equal('no extension');
                result.property.should.equal('files');

                result = ConfigValidator.validate({
                    type: 'application',
                    host: 'linux',
                    files: ['file.'],
                    outputName: 'app',
                });
                result.valid.should.be.false();
                result.error.should.equal('no extension');
                result.property.should.equal('files');

                result = ConfigValidator.validate({
                    type: 'application',
                    host: 'linux',
                    files: ['file.1'],
                    outputName: 'app',
                });
                result.valid.should.be.true();
            });
        });

        describe('Filenames are not paths', function () {
            it('should return {valid: false, error: "cannot be path", property: "outputName"} given a path in outputName', function () {
                var invalidOutputName = function (outputName) {
                    var result = ConfigValidator.validate({
                        type: 'application',
                        host: 'linux',
                        files: ['main.c'],
                        outputName: outputName,
                    });
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
