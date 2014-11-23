
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
var exec = require('child_process').exec;
var util = require('./util.js');
var shell = require('../source/shell.js');

var setup = function () {
    /* Single file */
    fs.writeFileSync(
        "temp/simple.c",

         "#include <stdio.h>\n"
        +"int main(int argc, char** argv) {\n"
        +"  printf(\"%d\", 42);\n"
        +"  return 0;\n"
        +"}\n");
};

describe('Front-end', function () {
    it('should take a flag to specify the target host', function (done) {
        util.generateCompileAndRun({
            setup: setup,
            config: {
                files: [
                    'simple.c'
                ]
            },
            command: 'simple',
            expectOutputToMatch: '42',
            parameters: '--host ' + process.platform
        }, done);
    });

    it('should take a flag to specify the output build file name', function (done) {
        util.generateCompileAndRun({
            setup: setup,
            config: {
                files: [
                    'simple.c'
                ],
                host: process.platform
            },
            makefile: 'Makefile.platform',
            command: 'simple',
            expectOutputToMatch: '42',
            parameters: '--buildFile Makefile.platform'
        }, done);
    });

    it('should fail with "Too many arguments" if too many non-flag arguments are passed', function (done) {
        shell.exec(shell.path('./duk') + ' ' + shell.path('./limbus-buildgen.js') + ' file.json file2.json', null, function (error, stdout, stderr) {
            (!error).should.be.false;
            stdout.should.containEql('Too many arguments');
            done();
        });
    });

    it('should fail with "No configuration file" if no config file is provided', function (done) {
        shell.exec(shell.path('./duk') + ' ' + shell.path('./limbus-buildgen.js'), null, function (error, stdout, stderr) {
            (!error).should.be.false;
            stdout.should.containEql('No configuration file');
            done();
        });
    });

    it('should output usage information if given the --help flag', function (done) {
        shell.exec(shell.path('./duk') + ' ' + shell.path('./limbus-buildgen.js') + ' --help', null, function (error, stdout, stderr) {
            (!error).should.be.true;
            stdout.should.containEql('Usage:');
            done();
        });
    });

    it('should fail with "Flag <flag> is missing a value" if a flag requiring a value is missing one', function (done) {
        var requiresValue = [
            'host',
            'buildFile'
        ];

        var fails = [];

        util.forEachAsync(requiresValue, function (flag, index, done) {
            shell.exec(shell.path('./duk') + ' ' + shell.path('./limbus-buildgen.js') + ' --' + flag, null, function (error, stdout, stderr) {
                if (error && stdout.indexOf('Flag --' + flag + ' is missing a value') !== -1) {
                    fails.push(error);
                }
                done();
            });
        }, function () {
            fails.length.should.equal(requiresValue.length);
            done();
        });
    });

    it('should fail if the config file is not valid JSON', function (done) {
        util.generateCompileAndRun({
            setup: setup,
            config: "{ files: 'test.c' }",
            command: 'simple'
        }, function (error) {
            (!error).should.be.false;
            done();
        });
    });

    it('should fail with "Unknown property \'<property>\' in configuration" if the config file contains an unknown property', function (done) {
        util.generateCompileAndRun({
            setup: setup,
            config: {
                files: [
                    'simple.c'
                ],
                someUnknownProperty: 'this should fail'
            },
            command: 'simple'
        }, function (error) {
            (!error).should.be.false
            error.stdout.should.containEql('Unknown property \'someUnknownProperty\' in configuration');
            done();
        });
    });

    it('should fail with "Unknown flag \'<flag>\'" if given an unknown flag', function (done) {
        util.generateCompileAndRun({
            setup: setup,
            config: {
                files: [
                    'simple.c'
                ]
            },
            command: 'simple',
            parameters: '--some-flag value'
        }, function (error) {
            (!error).should.be.false;
            error.message.should.containEql("Unknown flag '--some-flag'");
            done();
        });
    });
});
