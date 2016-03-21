
// limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
// Written in 2016 by Jesper Oskarsson jesosk@gmail.com
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

        describe('Missing required properties', function () {
            it('should return {valid: false, error: "missing type"} when missing a type', function () {
                var result = ConfigValidator.validate({
                    host: 'linux',
                    files: ['main.c'],
                    outputName: 'app'
                });
                result.valid.should.be.false();
                result.error.should.equal('missing type');
            });

            it('should return {valid: false, error: "missing host"} when missing a host', function () {
                var result = ConfigValidator.validate({
                    type: 'application',
                    files: ['main.c'],
                    outputName: 'app'
                });
                result.valid.should.be.false();
                result.error.should.equal('missing host');
            });

            it('should return {valid: false, error: "missing files"} when missing source files', function () {
                var result = ConfigValidator.validate({
                    type: 'application',
                    host: 'linux',
                    outputName: 'app'
                });
                result.valid.should.be.false();
                result.error.should.equal('missing files');
            });

            it('should return {valid: false, error: "missing outputName"} when missing an output name', function () {
                var result = ConfigValidator.validate({
                    type: 'application',
                    host: 'linux',
                    files: ['main.c']
                });
                result.valid.should.be.false();
                result.error.should.equal('missing outputName');
            });
        });

        describe('Valid type values', function () {
            it('should return {valid: false, error: "invalid type"} when type is an invalid value', function () {
                var result = ConfigValidator.validate({
                    type: 'invalid-type',
                    host: 'linux',
                    files: ['main.c'],
                    outputName: 'app'
                });
                result.valid.should.be.false();
                result.error.should.equal('invalid type');

                result = ConfigValidator.validate({
                    type: 'other-invalid-type',
                    host: 'linux',
                    files: ['main.c'],
                    outputName: 'app'
                });
                result.valid.should.be.false();
                result.error.should.equal('invalid type');
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
            it('should return {valid: false, error: "invalid host"} when host is an invalid value', function () {
                var result = ConfigValidator.validate({
                    type: 'application',
                    host: 'invalid-host',
                    files: ['main.c'],
                    outputName: 'app'
                });
                result.valid.should.be.false();
                result.error.should.equal('invalid host');

                result = ConfigValidator.validate({
                    type: 'application',
                    host: 'other-invalid-host',
                    files: ['main.c'],
                    outputName: 'app'
                });
                result.valid.should.be.false();
                result.error.should.equal('invalid host');
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
            it('should return {valid: false, error: "outputName is not a string"} when outputName is not a string', function () {
                var result = ConfigValidator.validate({
                    type: 'application',
                    host: 'linux',
                    files: ['main.c'],
                    outputName: 1
                });
                result.valid.should.be.false();
                result.error.should.equal('outputName is not a string');
            });

            it('should return {valid: false, error: "outputPath is not a string"} when outputPath is not a string', function () {
                var result = ConfigValidator.validate({
                    type: 'application',
                    host: 'linux',
                    files: ['main.c'],
                    outputName: 'app',
                    outputPath: 123
                });
                result.valid.should.be.false();
                result.error.should.equal('outputPath is not a string');
            });

            it('should return {valid: false, error: "compilerFlags is not a string"} when compilerFlags is not a string', function () {
                var result = ConfigValidator.validate({
                    type: 'application',
                    host: 'linux',
                    files: ['main.c'],
                    outputName: 'app',
                    compilerFlags: 123
                });
                result.valid.should.be.false();
                result.error.should.equal('compilerFlags is not a string');
            });

            it('should return {valid: false, error: "linkerFlags is not a string"} when linkerFlags is not a string', function () {
                var result = ConfigValidator.validate({
                    type: 'application',
                    host: 'linux',
                    files: ['main.c'],
                    outputName: 'app',
                    linkerFlags: 123
                });
                result.valid.should.be.false();
                result.error.should.equal('linkerFlags is not a string');
            });
        });

        describe('Valid string array properties', function () {
            it('should return {valid: false, error: "files is not a string array"} if files is not a string array', function () {
                var result = ConfigValidator.validate({
                    type: 'application',
                    host: 'linux',
                    files: ['main.c', 3],
                    outputName: 'app'
                });
                result.valid.should.be.false();
                result.error.should.equal('files is not a string array');
            });

            it('should return {valid: false, error: "includePaths is not a string array"} if includePaths is not a string array', function () {
                var result = ConfigValidator.validate({
                    type: 'application',
                    host: 'linux',
                    files: ['main.c'],
                    outputName: 'app',
                    includePaths: [3]
                });
                result.valid.should.be.false();
                result.error.should.equal('includePaths is not a string array');
            });

            it('should return {valid: false, error: "libraries is not a string array"} if libraries is not a string array', function () {
                var result = ConfigValidator.validate({
                    type: 'application',
                    host: 'linux',
                    files: ['main.c'],
                    outputName: 'app',
                    libraries: [3]
                });
                result.valid.should.be.false();
                result.error.should.equal('libraries is not a string array');
            });
        });
    });
});
