
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

         "int main(int argc, char** argv) {\n"
        +"  return 0;\n"
        +"}\n");
};

describe('Front-end', function () {
    it('should take a parameter to specify the target host', function (done) {
        util.generateCompileAndRun({
            setup: setup,
            config: {
                files: [
                    'simple.c'
                ]
            },
            command: 'simple',
            parameters: '--host ' + process.platform
        }, done);
    });

    it('should take a parameter to specify the output build file name', function (done) {
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
            parameters: '--buildFile Makefile.platform'
        }, done);
    });

    it('should fail if too many non-flag arguments are passed', function (done) {
        shell.exec(shell.path('./duk') + ' ' + shell.path('./limbus-buildgen.js') + ' file.json file2.json', null, function (error, stdout, stderr) {
            (!error).should.be.false;
            done();
        });
    });

    it('should fail with "No configuration file" if no config file is provided', function (done) {
        shell.exec(shell.path('./duk') + ' ' + shell.path('./limbus-buildgen.js'), null, function (error, stdout, stderr) {
            (!error).should.be.false;
            stdout.indexOf('No configuration file').should.not.equal(-1);
            done();
        });
    });

    it('should output usage information if given the --help flag', function (done) {
        shell.exec(shell.path('./duk') + ' ' + shell.path('./limbus-buildgen.js') + ' --help', null, function (error, stdout, stderr) {
            (!error).should.be.true;
            stdout.indexOf('Usage:').should.not.equal(-1);
            done();
        });
    });

    it('should fail if flags requiring a value is missing one', function (done) {
        var requiresValue = [
            'host',
            'buildFile'
        ];

        util.forEachAsync(requiresValue, function (flag, index, done) {
            shell.exec(shell.path('./duk') + ' ' + shell.path('./limbus-buildgen.js') + ' --' + flag, null, function (error, stdout, stderr) {
                if (!error) {
                    return done(new Error('Missing flag did not produce an error'));
                } else {
                    return done();
                }
            });
        }, done);
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

    it('should fail if the config file contains unknown properties', function (done) {
        util.generateCompileAndRun({
            setup: setup,
            config: {
                files: [
                    'simple.c'
                ],
                someUnknownParameter: 'this should fail'
            },
            command: 'simple'
        }, function (error) {
            (!error).should.be.false;
            done();
        });
    });

    it('should fail if given unknown flag', function (done) {
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
            done();
        });
    });
});
