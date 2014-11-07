
// sea-strap.js - A "build anywhere" C/C++ makefile/project generator.
// Written in 2014 by Jesper Oskarsson jesosk@gmail.com
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain worldwide.
// This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along with this software.
// If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

var should = require('should');
var shell = require('shelljs');
var util = require('./makefile-generator.util.js');

var setup = function (done) {
    /* Single file */
    ("int main(int argc, char** argv) {\n"
    +"  return 0;\n"
    +"}\n").to("simple.c");

    done();
};

describe('makefile-generator-simple', function () {
    it('should compile a single file', function (done) {
        util.shouldCompileAndRun(setup, {
            files: [
                'simple.c'
            ],
            host: process.platform
        }, 'simple', done);
    });

    it('should compile to an executable with outputName', function (done) {
        util.shouldCompileAndRun(setup, {
            files: [
                'simple.c'
            ],
            host: process.platform,
            outputName: 'my_executable'
        }, 'my_executable', done);
    });
});
