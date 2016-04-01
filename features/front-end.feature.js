
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
var util = require('./util.js');
var shell = require('./shell.js');

describe('Front-end', function () {
    beforeEach(function () {
        return util.beforeEach();
    });

    afterEach(function () {
        return util.afterEach();
    });

    it('should take a flag to specify the target host', function () {
        return util.generateCompileAndRun({
            config: {
                type: 'application',
                files: [
                    'simple.c'
                ],
                outputName: 'simple'
            },
            command: 'simple',
            expectOutputToMatch: '42',
            parameters: '--host ' + util.host
        });
    });

    it('should take a flag to specify the output build file name', function () {
        return util.generateCompileAndRun({
            config: {
                type: 'application',
                host: util.host,
                files: [
                    'simple.c'
                ],
                outputName: 'simple'
            },
            makefile: 'Makefile.platform',
            command: 'simple',
            expectOutputToMatch: '42',
            parameters: '--buildFile Makefile.platform'
        });
    });

    it('should fail with "Too many arguments" if too many non-flag arguments are passed', function () {
        return shell.exec(util.frontEndExecutable + ' file.json file2.json').then(function () {
            return Promise.reject(new Error('Did not fail'));
        }, function (error) {
            return error.stdout.should.containEql('Too many arguments');
        });
    });

    it('should fail with "No configuration file" if no config file is provided', function () {
        return shell.exec(util.frontEndExecutable).then(function () {
            return Promise.reject(new Error('Did not fail'));
        }, function (error) {
            return error.stdout.should.containEql('No configuration file');
        });
    });

    it('should output usage information if given the --help flag', function () {
        return shell.exec(util.frontEndExecutable + ' --help').then(function (result) {
            return result.stdout.should.containEql('Usage:');
        });
    });

    it('should fail with "Flag <flag> is missing a value" if a flag requiring a value is missing one', function () {
        return Promise.all([
            shell.exec(util.frontEndExecutable + ' --host').then(function () {
                return Promise.reject(new Error('Did not fail'));
            }, function (error) {
                return error.stdout.should.containEql('Flag --host is missing a value');
            }),
            shell.exec(util.frontEndExecutable + ' --buildFile').then(function () {
                return Promise.reject(new Error('Did not fail'));
            }, function (error) {
                return error.stdout.should.containEql('Flag --buildFile is missing a value');
            })
        ]);
    });

    it('should fail if the config file is not valid JSON', function () {
        return util.generateCompileAndRun({
            config: "{ files: 'test.c' }",
            command: 'simple'
        }).should.be.rejected();
    });

    it('should fail with "Unknown flag \'<flag>\'" if given an unknown flag', function () {
        return util.generateCompileAndRun({
            config: {
                type: 'application',
                host: util.host,
                files: [
                    'simple.c'
                ],
                outputName: 'simple'
            },
            command: 'simple',
            parameters: '--some-flag value'
        }).then(function () {
            return Promise.reject(new Error('Did not fail'));
        }, function (error) {
            return error.message.should.containEql("Unknown flag '--some-flag'");
        });
    });
});
