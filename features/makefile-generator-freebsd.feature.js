
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

// Only run these tests on the correct platform
if (process.platform === 'freebsd') {
    describe('makefile-generator-freebsd', function () {
        beforeEach(function (done) {
            util.setupEnvironment(function () {
                /* Check for libm */
                ("int main(int argc, char** argv) {\n"
                +"  return ciel(0.5f) - 1;\n"
                +"}\n").to("math.c");

                done();
            });
        });

        afterEach(util.teardownEnvironment);

        it('should compile with libm by default', function (done) {
            util.compileAndRunConfig({
                files: [
                    'math.c'
                ]
            }, './math', done);
        });
    });
}
