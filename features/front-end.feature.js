
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

    it('should fail if not all flags match up with values', function (done) {
        util.generateCompileAndRun({
            setup: setup,
            config: {
                files: [
                    'simple.c'
                ]
            },
            command: 'simple',
            parameters: '--host '
        }, function (error) {
            (error === undefined).should.be.false;
            done();
        });
    });

    it('should fail if the config file is malformed', function (done) {
        util.generateCompileAndRun({
            setup: setup,
            config: "{ files: }",
            command: 'simple'
        }, function (error) {
            (error === undefined).should.be.false;
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
            (error === undefined).should.be.false;
            done();
        });
    });
});
